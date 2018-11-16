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

	@Column("varchar", { length: 255, nullable: true })
	email: string | null;

	@Column("text", { nullable: true })
	password: string | null;

	@Column({ default: false })
	confirmed: boolean;

	@Column({ default: false })
	forgotPasswordLocked: boolean;

	@Column("text", { nullable: true })
	twitterId: string | null;

	@BeforeInsert()
	async hashPasswordBeforeInsert() {
		if (this.password) {
			this.password = await bcrypt.hash(this.password, 10);
		}
	}
}
