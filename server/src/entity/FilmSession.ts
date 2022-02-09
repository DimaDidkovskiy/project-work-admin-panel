import "reflect-metadata";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import Technology from "./Technologies";

@Entity("FilmSession")
export default class FilmSession {
    @PrimaryGeneratedColumn("uuid")
    film_session_id: string;

    @Column({ type: "date", nullable: false })
    session_date: Date;

    @Column({ type: "time", nullable: false })
    session_time: string;

    @Column({ type: "varchar", nullable: false })
    filmId: string;

    @ManyToOne(() => Technology, (technology) => technology.film_session)
    session_technology: Technology;
}
