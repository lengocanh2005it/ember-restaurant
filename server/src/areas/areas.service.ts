import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CreateAreaDto } from 'src/areas/dtos/create-area.dto';
import { UpdateAreaDto } from 'src/areas/dtos/update-area.dto';
import { Area } from 'src/areas/entities/areas.entity';
import { Table } from 'src/tables/entities/tables.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(Area) private readonly areaRepository: Repository<Area>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<Area[]> {
    return await this.areaRepository.find({
      relations: ['tables'],
    });
  }

  async findOne(id: string): Promise<Area> {
    const area = await this.areaRepository.findOne({
      where: {
        id,
      },
      relations: ['tables'],
    });

    if (!area) throw new NotFoundException('Area Not Found.');

    return area;
  }

  async createOne(createAreaDto: CreateAreaDto): Promise<Area> {
    const area = this.areaRepository.create(createAreaDto);
    return await this.areaRepository.save(area);
  }

  async updateOne(
    updateAreaDto: UpdateAreaDto,
    id: string,
  ): Promise<Record<string, Area | Area[]>> {
    const area = await this.areaRepository.findOne({
      where: { id },
      relations: ['tables'],
    });

    if (!area) throw new NotFoundException('Area Not Found.');

    const { tableIds, ...res } = updateAreaDto;

    await this.areaRepository.update({ id }, res);

    for (const tableId of tableIds) {
      const findTable = await this.dataSource
        .getRepository(Table)
        .createQueryBuilder('table')
        .leftJoinAndSelect('table.area', 'area')
        .where('area.id IS NULL')
        .andWhere('table.id = :id', { id: tableId })
        .getOne();

      if (findTable) {
        await this.dataSource
          .createQueryBuilder()
          .relation(Table, 'area')
          .of(findTable.id)
          .set(id);
      }
    }

    for (const tableId of area.tables.map((table) => table.id)) {
      if (!tableIds.some((table) => table === tableId)) {
        await this.dataSource
          .createQueryBuilder()
          .relation(Area, 'tables')
          .of(id)
          .remove(tableId);
      }
    }

    return {
      areas: await this.findAll(),
      area: await this.findOne(id),
    };
  }

  async deleteOne(id: string): Promise<Area[]> {
    const area = await this.areaRepository.findOneBy({ id });
    if (!area) throw new NotFoundException('Area Not Found.');
    return await this.findAll();
  }

  public addTableToArea = async (
    areaId: string,
    tableId: string,
  ): Promise<void> => {
    await this.areaRepository
      .createQueryBuilder('area')
      .relation(Area, 'tables')
      .of(areaId)
      .add(tableId);
  };
}
