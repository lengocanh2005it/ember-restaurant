import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/permissions/entities/permissions.entity';
import { PermissionsService } from 'src/permissions/permissions.service';
import { CreateRoleDto } from 'src/roles/dtos/create-role.dto';
import { Role } from 'src/roles/entities/roles.entity';
import { User } from 'src/users/entities/users.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly permissionsService: PermissionsService,
  ) {}

  async onModuleInit() {
    await this.initializeRolesAndPermissions();
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findAllPermissionByRoleName(name: string) {
    const rolesWithPermissions = await this.roleRepository.findOne({
      where: {
        name,
      },
      relations: ['permissions'],
      select: {
        id: true,
        name: true,
        permissions: {
          name: true,
        },
      },
    });

    return rolesWithPermissions;
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const newRole = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(newRole);
  }

  async findRoleByName(name: string): Promise<Role> {
    return await this.roleRepository.findOneBy({ name });
  }

  async addPermissionToRole(role: Role, permission: Permission): Promise<void> {
    await this.roleRepository
      .createQueryBuilder('role')
      .relation(Role, 'permissions')
      .of(role.id)
      .add(permission.id);
  }

  async assignPermissions(
    roleId: string,
    permissions: Permission[],
  ): Promise<Role[]> {
    for (const permission of permissions) {
      await this.roleRepository
        .createQueryBuilder('role')
        .relation(Role, 'permissions')
        .of(roleId)
        .add(permission.id);
    }

    return await this.roleRepository.find({
      relations: ['permissions'],
    });
  }

  private initializeRolesAndPermissions = async (): Promise<void> => {
    const roles = [
      {
        name: 'user',
        permissions: [
          {
            name: 'READ_DATA',
            description: 'Allows reading data from the system.',
          },
        ],
      },
      {
        name: 'admin',
        permissions: [
          {
            name: 'READ_DATA',
            description: 'Allows reading data from the system.',
          },
          {
            name: 'UPDATE_DATA',
            description: 'Allows update data from the system.',
          },
          {
            name: 'DELETE_DATA',
            description: 'Allows delete data from the system.',
          },
        ],
      },
      {
        name: 'manager',
        permissions: [
          {
            name: 'READ_DATA',
            description: 'Allows reading data from the system.',
          },
          {
            name: 'DELETE_DATA',
            description: 'Allows delete data from the system.',
          },
        ],
      },
    ];

    for (const role of roles) {
      let existingRole = await this.roleRepository.findOne({
        where: { name: role.name },
        relations: ['permissions'],
      });

      if (!existingRole) {
        const createRole = this.roleRepository.create({ name: role.name });

        await this.roleRepository.save(createRole);

        existingRole = await this.roleRepository.findOne({
          where: { name: role.name },
          relations: ['permissions'],
        });

        const permissionNames = role.permissions.map((p) => p.name);

        let permissions =
          await this.permissionsService.findAllByNames(permissionNames);

        const newPermissions = role.permissions.filter(
          (permission) => !permissions.some((p) => p.name === permission.name),
        );

        if (newPermissions.length) {
          permissions = [
            ...permissions,
            ...(await this.permissionsService.createMany(newPermissions)),
          ];
        }

        for (const permission of permissions) {
          if (!existingRole.permissions.some((p) => p.id === permission.id)) {
            await this.roleRepository
              .createQueryBuilder()
              .relation(Role, 'permissions')
              .of(existingRole.id)
              .add(permission.id);
          }
        }
      }
    }
  };

  public addRoleToUser = async (
    userId: string,
    roleId: string,
  ): Promise<void> => {
    await this.dataSource
      .createQueryBuilder()
      .relation(User, 'roles')
      .of(userId)
      .add(roleId);
  };
}
