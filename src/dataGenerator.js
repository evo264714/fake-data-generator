

const { faker } = require('@faker-js/faker');

const regions = {
    usa: { locale: 'en_US', name: ['John', 'Jane', 'Michael', 'Emily'], surname: ['Doe', 'Smith', 'Johnson', 'Brown'], city: ['New York', 'Los Angeles', 'Chicago', 'Houston'] },
    poland: { locale: 'pl', name: ['Jan', 'Anna', 'Piotr', 'Maria'], surname: ['Kowalski', 'Nowak', 'Wójcik', 'Kowalczyk'], city: ['Warsaw', 'Krakow', 'Łódź', 'Wrocław'] },
    georgia: { locale: 'ka_GE', name: ['Nika', 'Ana', 'Giorgi', 'Mariam'], surname: ['Beridze', 'Gelashvili', 'Dolidze', 'Tsiklauri'], city: ['Tbilisi', 'Batumi', 'Kutaisi', 'Rustavi'] }
};

function generateData(seed, region, errors, page) {
    faker.seed(parseInt(seed) + parseInt(page));
    const regionData = regions[region] || regions['usa'];
    const data = [];
    for (let i = 0; i < 20; i++) {
        let name = `${faker.helpers.arrayElement(regionData.name)} ${faker.helpers.arrayElement(regionData.surname)}`;
        let address = `${faker.helpers.arrayElement(regionData.city)}, ${faker.address.streetAddress()}`;
        let phone = faker.phone.number();

        if (errors > 0) {
            name = introduceErrors(name, errors);
            address = introduceErrors(address, errors);
            phone = introduceErrors(phone, errors);
        }

        data.push({
            index: i + 1 + (page - 1) * 20,
            id: faker.datatype.uuid(),
            name,
            address,
            phone
        });
    }
    return data;
}

function introduceErrors(text, errors) {
    for (let i = 0; i < errors; i++) {
        const errorType = faker.helpers.arrayElement(['delete', 'add', 'swap']);
        const position = faker.datatype.number({ min: 0, max: text.length - 1 });
        if (errorType === 'delete') {
            text = text.slice(0, position) + text.slice(position + 1);
        } else if (errorType === 'add') {
            const char = faker.random.alpha({ count: 1 });
            text = text.slice(0, position) + char + text.slice(position);
        } else if (errorType === 'swap') {
            if (position < text.length - 1) {
                const temp = text[position];
                text = text.slice(0, position) + text[position + 1] + temp + text.slice(position + 2);
            }
        }
    }
    return text;
}

module.exports = { generateData };
