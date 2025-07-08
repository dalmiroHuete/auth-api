import { HttpException } from '@nestjs/common';
export declare class GeocodingException extends HttpException {
    constructor(message: string);
}
