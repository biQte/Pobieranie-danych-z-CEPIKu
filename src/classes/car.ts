export default class Car {
    brand: string;
    model: string;
    yearManufactured: number;
    carType: string;
    fuelType: string;
    carSubType: string;

    constructor(
        _brand: string,
        _model: string,
        _yeahManufactured: number,
        _carType: string,
        _fuelType: string,
        _carSubType: string,
    ) {
        this.brand = _brand;
        this.model = _model;
        this.yearManufactured = _yeahManufactured;
        this.carType = _carType;
        this.fuelType = _fuelType;
        this.carSubType = _carSubType;
    }
}
