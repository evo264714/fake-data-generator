
const { faker } = require('@faker-js/faker');

function generateData(seed, region, errors, page) {
    faker.seed(parseInt(seed) + parseInt(page));
    
    const data = [];
    for (let i = 0; i < 20; i++) {
        let name = `${faker.person.firstName()} ${faker.person.lastName()}`;
        let address = `${faker.location.city()}, ${faker.location.streetAddress()}`;
        let phone = faker.phone.number();

        if (errors > 0) {
            name = introduceErrors(name, errors);
            address = introduceErrors(address, errors);
            phone = introduceErrors(phone, errors);
        }

        data.push({
            index: i + 1 + (page - 1) * 20,
            id: faker.string.uuid(),
            name,
            address,
            phone
        });
    }
    return data;
}

function introduceErrors(text, errors) {
    const textLength = text.length;

    for (let i = 0; i < errors; i++) {
        if (text.length === 0) break;

        const errorType = faker.helpers.arrayElement(['delete', 'add', 'swap']);
        const position = faker.number.int({ min: 0, max: text.length - 1 });

        if (errorType === 'delete') {
            text = text.slice(0, position) + text.slice(position + 1);
        } else if (errorType === 'add') {
            const char = faker.string.alpha({ count: 1 });
            text = text.slice(0, position) + char + text.slice(position);
        } else if (errorType === 'swap') {
            if (text.length > 1 && position < text.length - 1) {
                const temp = text[position];
                text = text.slice(0, position) + text[position + 1] + temp + text.slice(position + 2);
            }
        }

        if (i % Math.max(1, Math.floor(errors / 10)) === 0) {
            if (text.length > 0) {
                text = text.slice(0, position) + faker.string.alpha({ count: 1 }) + text.slice(position);
            }
        }
    }
    return text;
}

module.exports = { generateData };
