import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '../..');
const DATA_DIR = join(ROOT_DIR, 'data');

export class Database {
  constructor() {
    this.guilds = new Map();
    this.tickets = new Map();
    this.transcripts = new Map();
    this.translations = new Map();
    this.cache = new Map();
    this._ticketCounters = new Map();

    this.guildsFile = join(DATA_DIR, 'guilds.json');
    this.ticketsFile = join(DATA_DIR, 'tickets.json');
    this.transcriptsFile = join(DATA_DIR, 'transcripts.json');
    this.translationsFile = join(DATA_DIR, 'translations.json');
  }

  async ensureDirectories() {
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  loadData() {
    try {
      if (existsSync(this.guildsFile)) {
        const data = JSON.parse(readFileSync(this.guildsFile, 'utf-8'));
        this.guilds = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Falha ao carregar guilds:', error.message);
    }

    try {
      if (existsSync(this.ticketsFile)) {
        const data = JSON.parse(readFileSync(this.ticketsFile, 'utf-8'));
        this.tickets = new Map(Object.entries(data));
        this._rebuildCounters();
      }
    } catch (error) {
      console.error('Falha ao carregar tickets:', error.message);
    }

    try {
      if (existsSync(this.transcriptsFile)) {
        const data = JSON.parse(readFileSync(this.transcriptsFile, 'utf-8'));
        this.transcripts = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Falha ao carregar transcripts:', error.message);
    }

    try {
      if (existsSync(this.translationsFile)) {
        const data = JSON.parse(readFileSync(this.translationsFile, 'utf-8'));
        this.translations = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Falha ao carregar traduções:', error.message);
    }
  }

  _rebuildCounters() {
    for (const [, ticket] of this.tickets.entries()) {
      if (!ticket.guildId || !ticket.ticketId) continue;
      const num = parseInt(ticket.ticketId.replace('TKT-', ''), 10);
      if (!isNaN(num)) {
        const current = this._ticketCounters.get(ticket.guildId) || 0;
        if (num > current) this._ticketCounters.set(ticket.guildId, num);
      }
    }
  }

  saveGuilds() {
    try {
      const data = Object.fromEntries(this.guilds);
      writeFileSync(this.guildsFile, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Falha ao salvar guilds:', error.message);
    }
  }

  saveTickets() {
    try {
      const data = Object.fromEntries(this.tickets);
      writeFileSync(this.ticketsFile, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Falha ao salvar tickets:', error.message);
    }
  }

  saveTranscripts() {
    try {
      const data = Object.fromEntries(this.transcripts);
      writeFileSync(this.transcriptsFile, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Falha ao salvar transcripts:', error.message);
    }
  }

  saveTranslations() {
    try {
      const data = Object.fromEntries(this.translations);
      writeFileSync(this.translationsFile, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Falha ao salvar traduções:', error.message);
    }
  }

  getDefaultGuildConfig(guildId) {
    return {
      guildId,
      language: 'pt-BR',
      prefix: '!',
      useSlashCommands: true,
      usePrefixCommands: false,
      ticketCategoryId: null,
      logChannelId: null,
      staffRoles: [],
      supportRoles: [],
      adminRoles: [],
      maxTicketsPerUser: 3,
      autoCloseDays: 7,
      customMessages: {},
      templates: [
        {
          name: 'Suporte Geral',
          description: 'Dúvidas e suporte geral',
          emoji: '🎫',
          value: 'general'
        },
        {
          name: 'Suporte Técnico',
          description: 'Problemas técnicos',
          emoji: '🔧',
          value: 'technical'
        },
        {
          name: 'Denúncia',
          description: 'Reportar usuários',
          emoji: '⚠️',
          value: 'report'
        }
      ],
      features: {
        transcripts: true,
        autoClose: false,
        pingStaff: true,
        stats: true
      }
    };
  }

  async getGuildConfig(guildId) {
    if (!this.guilds.has(guildId)) {
      const defaultConfig = this.getDefaultGuildConfig(guildId);
      this.guilds.set(guildId, defaultConfig);
      this.saveGuilds();
    }
    return this.guilds.get(guildId);
  }

  async setGuildConfig(guildId, config) {
    this.guilds.set(guildId, { ...config, guildId });
    this.saveGuilds();
  }

  async generateTicketId(guildId) {
    const next = (this._ticketCounters.get(guildId) || 0) + 1;
    this._ticketCounters.set(guildId, next);
    return `TKT-${String(next).padStart(4, '0')}`;
  }

  getTicketKey(guildId, ticketId) {
    return `${guildId}:${ticketId}`;
  }

  async saveTicket(guildId, ticket) {
    const key = this.getTicketKey(guildId, ticket.ticketId);
    this.tickets.set(key, ticket);
    this.saveTickets();
  }

  async getTicket(guildId, ticketId) {
    const key = this.getTicketKey(guildId, ticketId);
    return this.tickets.get(key) || null;
  }

  async getTicketByChannel(guildId, channelId) {
    for (const [, ticket] of this.tickets.entries()) {
      if (ticket.guildId === guildId && ticket.channelId === channelId) {
        return ticket;
      }
    }
    return null;
  }

  async getAllTickets(guildId, filters = {}) {
    const tickets = [];
    for (const [, ticket] of this.tickets.entries()) {
      if (ticket.guildId !== guildId) continue;
      if (filters.status && ticket.status !== filters.status) continue;
      if (filters.authorId && ticket.authorId !== filters.authorId) continue;
      if (filters.type && ticket.type !== filters.type) continue;
      tickets.push(ticket);
    }
    return tickets;
  }

  async deleteTicket(guildId, ticketId) {
    const key = this.getTicketKey(guildId, ticketId);
    this.tickets.delete(key);
    this.saveTickets();
  }

  async saveTranscript(guildId, ticketId, transcript) {
    const key = this.getTicketKey(guildId, ticketId);
    this.transcripts.set(key, transcript);
    this.saveTranscripts();
  }

  async getStats(guildId) {
    const tickets = await this.getAllTickets(guildId);
    const now = Date.now();
    const today = new Date().setHours(0, 0, 0, 0);
    const weekAgo = now - (7 * 24 * 60 * 60 * 1000);

    const stats = {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      closed: tickets.filter(t => t.status === 'closed').length,
      claimed: tickets.filter(t => t.claimedBy).length,
      today: tickets.filter(t => new Date(t.createdAt).getTime() >= today).length,
      week: tickets.filter(t => new Date(t.createdAt).getTime() >= weekAgo).length,
      avgResponseTime: 15,
      byType: {}
    };

    tickets.forEach(t => {
      if (t.type) {
        stats.byType[t.type] = (stats.byType[t.type] || 0) + 1;
      }
    });

    return stats;
  }

  async getTranslationCache(targetLang, text) {
    const key = `${targetLang}:${text}`;
    return this.translations.get(key) || null;
  }

  async setTranslationCache(targetLang, text, translated) {
    const key = `${targetLang}:${text}`;
    this.translations.set(key, translated);
    this.saveTranslations();
  }
}
