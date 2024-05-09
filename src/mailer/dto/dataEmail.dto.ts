export class DataEmailDto {
    to: string;
    from?: string;
    subject: string;
    text: string;
    html: string;

    constructor(dataEmail) {
        this.to = dataEmail.to;
        this.from = dataEmail.from;
        this.subject = dataEmail.subject;
        this.text = dataEmail.text;
        this.html = dataEmail.html;
    }
}