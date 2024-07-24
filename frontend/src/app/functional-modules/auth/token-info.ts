export class TokenInfo {
    constructor(
        public readonly token: string,
        public readonly exp: number,
        public readonly iat: number,
        public readonly role: string,
        public readonly email: string,
        public readonly name: string,
    ) {
    }

    public isExpired(): boolean {
        const currentTime = Math.floor(new Date().getTime() / 1000);
        return currentTime > this.exp;
    }
}
