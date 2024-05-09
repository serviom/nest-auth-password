import {Exclude, Expose} from 'class-transformer';

export class UserEntity {
    name: string;
    email: string;

    @Exclude()
    password: string;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }

    @Expose()
    get fullInfo(): string {
        return `${this.name} ${this.email}`;
    }
}
