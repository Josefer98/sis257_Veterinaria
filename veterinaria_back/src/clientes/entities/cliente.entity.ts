import { Mascota } from 'src/mascotas/entities/mascota.entity';
import { Venta } from 'src/ventas/entities/venta.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { name: 'nombres', length: 100 })
  nombres: string;

  @Column('varchar', { name: 'apellidos', length: 100 })
  apellidos: string;

  @Column('varchar', { name: 'telefono', length: 15, nullable: true })
  telefono: string;

  @Column('varchar', { name: 'direccion', length: 200, nullable: true })
  direccion: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => Venta, (venta) => venta.cliente)
  ventas: Venta[];

  @OneToMany(() => Mascota, (mascota) => mascota.clientes)
  mascotas: Mascota[];
}
