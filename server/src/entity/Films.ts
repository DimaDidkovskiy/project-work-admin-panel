import "reflect-metadata";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Films")
export default class Film {
    @PrimaryGeneratedColumn("uuid")
    film_id: string;

    @Column({ type: "varchar", nullable: false })
    film_name: string;

    @Column({ type: "date", nullable: false })
    release_date: Date;

    @Column({ type: "varchar", nullable: false })
    description: string;

    @Column({ type: "varchar", nullable: false })
    categories: string;

    @Column({ type: "varchar", nullable: false })
    main_actors: string;

    @Column({ type: "varchar", nullable: false })
    director: string;

    @Column({ type: "varchar", nullable: false })
    runtime: string;

    @Column({ type: "varchar", nullable: true })
    poster: string;
}
