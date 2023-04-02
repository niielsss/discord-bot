const { Client, Collection } = require('discord.js');
const { token, mongo_uri } = require('../config.json');
const { findFiles } = require('../util/findFiles.js');
const path = require('node:path');
const mongoose = require('mongoose');

module.exports = class BotClient extends Client {
    constructor(config) {
        super(config.options);
        this.commands = new Collection();
    }

    async start() {
        await this.loadCommands();
        await this.loadEvents();
        await this.connect(mongo_uri);
        await this.login(token);
        await this.registerCommands();
    }

    async loadCommands() {
        const commandFiles = findFiles(path.join(__dirname, '/../commands'), ['.js']);
        commandFiles.forEach(file => {
            const command = require(file);
            if ('data' in command && 'execute' in command) {
                this.commands.set(command.data.name, command);
            } else {
                console.error(`Command ${file} does not have a data or execute property`);
            }
        });
    }

    async loadEvents() {
        const eventFiles = findFiles(path.join(__dirname, '/../events'), ['.js']);
        eventFiles.forEach(file => {
            const event = require(file);
            if (event.once) {
                this.once(event.name, (...args) => event.execute(...args));
            } else {
                this.on(event.name, (...args) => event.execute(...args));
            }
        });
    }

    async registerCommands() {
        const commands = await this.application.commands.set(this.commands.map(command => command.data));
        console.log(`Successfully registered ${commands.size} commands`);
    }

    async connect(mongo_uri) {
        await mongoose.connect(mongo_uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    }
}