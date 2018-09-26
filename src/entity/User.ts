import * as bcrypt from "bcryptjs";
import {
	Entity,
	Column,
	BaseEntity,
	PrimaryGeneratedColumn,
	BeforeInsert
} from "typeorm";

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column("varchar", { length: 255 })
	email: string;

	@Column("text")
	password: string;

	@Column({ default: false })
	confirmed: boolean;

	@Column({ default: false })
	forgotPasswordLocked: boolean;

	@BeforeInsert()
	async hashPasswordBeforeInsert() {
		this.password = await bcrypt.hash(this.password, 10);
	}
}
