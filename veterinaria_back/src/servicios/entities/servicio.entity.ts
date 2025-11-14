import { Facturaserivicio } from 'src/facturaserivicios/entities/facturaserivicio.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('servicios')
export class Servicio {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { name: 'nombre', length: 100 })
  nombre: string;

  @Column('varchar', { name: 'descripcion', length: 500 })
  descripcion: string;

  @Column('varchar', { name: 'tipo_servicio', length: 500 })
  tipoServicio: string;

  @Column('decimal', { name: 'precio', precision: 10, scale: 2 })
  precio: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;
  
  @OneToMany(
    () => Facturaserivicio,
    (facturaserivicio) => facturaserivicio.servicio,
  )
  facturaserivicios: Facturaserivicio[];
}
