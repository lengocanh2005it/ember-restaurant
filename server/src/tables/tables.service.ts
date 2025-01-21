import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { AreasService } from 'src/areas/areas.service';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { CreateTableDto } from 'src/tables/dtos/create-table.dto';
import { UpdateTableDto } from 'src/tables/dtos/update-table.dto';
import { Table } from 'src/tables/entities/tables.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    private readonly areasService: AreasService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async findAll(queries?: Record<string, string>): Promise<Table[]> {
    let tables = await this.tableRepository.find();

    if (queries) {
      if (queries.areaId && queries.type === 'undefined') {
        tables = await this.tableRepository.find({
          where: {
            area: { id: queries.areaId },
          },
          relations: ['area'],
        });
      } else if (queries.areaId && queries.type !== 'undefined') {
        tables = await this.tableRepository.find({
          where: {
            area: { id: queries.areaId },
            type: queries.type,
          },
          relations: ['area'],
        });
      } else if (queries.options === 'none') {
        tables = await this.tableRepository
          .createQueryBuilder('table')
          .leftJoinAndSelect('table.area', 'area')
          .where('area.id IS NULL')
          .getMany();
      }
    }

    return tables;
  }

  async findOne(id: string): Promise<Table> {
    const table = await this.tableRepository.findOneBy({ id });
    if (!table) throw new NotFoundException('Table Not Found.');
    return table;
  }

  async createOne(createTableDto: CreateTableDto): Promise<Table[]> {
    const { areaId } = createTableDto;

    const table = this.tableRepository.create(createTableDto);

    await this.tableRepository.save(table);

    await this.areasService.addTableToArea(areaId, table.id);

    return await this.tableRepository.find();
  }

  async updateOne(updateTableDto: UpdateTableDto, id: string): Promise<any> {
    const table = await this.tableRepository.findOneBy({ id });

    if (!table) throw new NotFoundException('Table Not Found.');

    const { areaId, ...res } = updateTableDto;

    await this.tableRepository.update({ id }, res);

    return await this.areasService.findOne(areaId);
  }

  async deleteOne(id: string): Promise<Table[]> {
    const table = await this.tableRepository.findOneBy({ id });
    if (!table) throw new NotFoundException('Table Not Found.');
    return await this.tableRepository.find();
  }

  public addTablesToReservation = async (
    tablesIds: string[],
    reservationId: string,
    areaId: string,
    guests_count: number,
  ): Promise<void> => {
    const area = await this.areasService.findOne(areaId);

    if (area.status === 'maintenance')
      throw new BadRequestException('This area is being maintaining.');

    if (area.capacity < guests_count)
      throw new BadRequestException(
        'The area does not have enough customers required.',
      );

    for (const tableId of tablesIds) {
      const table = await this.tableRepository.findOne({
        where: {
          id: tableId,
          area: { id: areaId },
        },
        relations: ['area'],
      });

      if (!table) throw new NotFoundException('Table Not Found.');

      if (table.status === 'maintenance')
        throw new BadRequestException(`Table ${tableId} has been maintained.`);

      if (table.area.id !== areaId)
        throw new BadRequestException(
          "This table doesn't been along with this area.",
        );

      await this.dataSource
        .createQueryBuilder()
        .relation(Table, 'reservations')
        .of(table.id)
        .add(reservationId);

      await this.tableRepository.update(
        {
          id: tableId,
        },
        {
          is_reserved: true,
        },
      );
    }
  };

  public calculateTotalPrice = async (tableIds: string[]): Promise<number> => {
    let total_price = 0;

    for (const tableId of tableIds) {
      const table = await this.tableRepository.findOneBy({ id: tableId });

      if (!table) throw new NotFoundException('Table Not Found.');

      total_price += parseFloat(table.price.toString());
    }

    return Math.max(total_price, 0);
  };

  public updateTablesOfReservation = async (
    tableIds: string[],
    areaId: string,
    reservation: Reservation,
    guests_count: number,
  ): Promise<void> => {
    const area = await this.areasService.findOne(areaId);

    if (area.status === 'maintenance')
      throw new BadRequestException('This area is being maintaining.');

    if (area.capacity < guests_count)
      throw new BadRequestException(
        'The area does not have enough customers required.',
      );

    const newTablesIds = [] as string[];
    const tableIdsToDelete = [] as string[];

    for (const tableId of tableIds) {
      const table = await this.tableRepository.findOne({
        where: {
          id: tableId,
        },
        relations: ['area'],
      });

      if (!table) throw new NotFoundException('Table Not Found.');

      if (table.status === 'maintenance')
        throw new BadRequestException(`Table ${tableId} has been maintained.`);

      if (table.area.id !== areaId)
        throw new BadRequestException(
          "This table doesn't been along with this area.",
        );

      if (!reservation.tables.some((table) => table.id === tableId)) {
        newTablesIds.push(tableId);
      }
    }

    const reservationTableIds = reservation.tables.map((table) => table.id);

    for (const tableId of reservationTableIds) {
      if (!tableIds.some((table) => table === tableId)) {
        tableIdsToDelete.push(tableId);
      }
    }

    for (const newTableId of newTablesIds) {
      await this.dataSource
        .createQueryBuilder()
        .relation(Reservation, 'tables')
        .of(reservation.id)
        .add(newTableId);
    }

    for (const tableIdToDelete of tableIdsToDelete) {
      await this.dataSource
        .createQueryBuilder()
        .relation(Reservation, 'tables')
        .of(reservation.id)
        .remove(tableIdToDelete);

      await this.tableRepository.update(
        {
          id: tableIdToDelete,
        },
        {
          is_reserved: false,
        },
      );
    }
  };
}
