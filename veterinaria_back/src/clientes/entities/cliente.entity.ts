import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('clientes')
export class Cliente {
    @PrimaryGeneratedColumn('identity')
    id: number;

    @Column('varchar', { name: 'nombres', length: 100 })
    nombres: string;
    
    @Column('varchar', { name: 'apellidos', length: 100 })
    apellidos: string;
    
    @Column('varchar', { name: 'telefono', length: 15 })
    telefono: string;
    
    @Column('varchar', { name: 'nombre_mascota', length: 50 })
    nombreMascota: string;
    
    @Column('varchar', { name: 'tipo_mascota', length: 50 })
    tipoMascota: string;
    
    @Column('varchar', { name: 'raza', length: 50 })
    raza: string;
    
    @Column('int', { name: 'edad_mascota' })
    edadMascota: number;
}
