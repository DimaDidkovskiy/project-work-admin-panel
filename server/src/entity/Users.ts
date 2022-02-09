import "reflect-metadata";
import { Column, PrimaryGeneratedColumn, Entity } from "typeorm";

export enum UserRole {
    admin = "admin",
    manager = "manager",
}

@Entity("Users")
export default class Users {
    @PrimaryGeneratedColumn("uuid")
    user_id: string;

    @Column({ type: "varchar", nullable: false })
    first_name: string;

    @Column({ type: "varchar", nullable: true })
    surename: string;

    @Column({ type: "varchar", nullable: true })
    second_name: string;

    @Column({ type: "varchar", nullable: false, unique: true })
    email: string;

    @Column({ type: "varchar", nullable: true })
    phone_number1: string;

    @Column({ type: "varchar", nullable: true })
    phone_number2: string;

    @Column({ type: "varchar", nullable: true })
    user_role: UserRole;

    @Column({ type: "varchar", nullable: false })
    password: string;
}
