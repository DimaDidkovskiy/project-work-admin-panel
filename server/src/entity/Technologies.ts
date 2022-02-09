import "reflect-metadata";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import FilmSession from "./FilmSession";

@Entity("Technologies")
export default class Technology {
    @PrimaryGeneratedColumn("uuid")
    technology_id: string;

    @Column({ type: "varchar", nullable: false })
    technology_name: string;

    @OneToMany(
        () => FilmSession,
        (film_session) => film_session.session_technology
    )
    film_session: FilmSession[];
}
