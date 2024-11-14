const fs = require('fs');
const path = require('path');

// Define the path to the contacts file in the data directory
const contactsFilePath = path.join(__dirname, '../data/contacts.txt');

// Ensure the data directory exists
if (!fs.existsSync(path.dirname(contactsFilePath))) {
    fs.mkdirSync(path.dirname(contactsFilePath), { recursive: true });
}

function loadContacts() {
    if (!fs.existsSync(contactsFilePath)) return [];
    const contacts = fs.readFileSync(contactsFilePath, 'utf-8').split('\n');
    return contacts.filter(contact => contact.trim() !== ''); // Remove empty lines
}

function removeContact(phoneNumber) {
    const contacts = loadContacts();
    const updatedContacts = contacts.filter(contact => contact.trim() !== phoneNumber.trim());
    fs.writeFileSync(contactsFilePath, updatedContacts.join('\n'));
}

module.exports = { loadContacts, removeContact };
