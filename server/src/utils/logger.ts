// logger.ts
type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export class Logger {
  private static level: LogLevel = "info";
  private static showTimestamp = true;
  private static showLevel = true;

  static configure(
    options: {
      level?: LogLevel;
      showTimestamp?: boolean;
      showLevel?: boolean;
    } = {}
  ): void {
    if (options.level) this.level = options.level;
    if (options.showTimestamp !== undefined)
      this.showTimestamp = options.showTimestamp;
    if (options.showLevel !== undefined) this.showLevel = options.showLevel;
  }

  private static shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.level];
  }

  private static format(level: LogLevel, message: string): string {
    const parts: string[] = [];

    if (this.showTimestamp) parts.push(`[${new Date().toISOString()}]`);
    if (this.showLevel) parts.push(`[${level.toUpperCase()}]`);

    parts.push(message);
    return parts.join(" ");
  }

  private static color(level: LogLevel, message: string): string {
    switch (level) {
      case "debug":
        return `\x1b[36m${message}\x1b[0m`; // cyan
      case "info":
        return `\x1b[32m${message}\x1b[0m`; // green
      case "warn":
        return `\x1b[33m${message}\x1b[0m`; // yellow
      case "error":
        return `\x1b[31m${message}\x1b[0m`; // red
      default:
        return message;
    }
  }

  static debug(msg: string): void {
    if (this.shouldLog("debug"))
      console.debug(this.color("debug", this.format("debug", msg)));
  }

  static info(msg: string): void {
    if (this.shouldLog("info"))
      console.info(this.color("info", this.format("info", msg)));
  }

  static warn(msg: string): void {
    if (this.shouldLog("warn"))
      console.warn(this.color("warn", this.format("warn", msg)));
  }

  static error(msg: string): void {
    if (this.shouldLog("error"))
      console.error(this.color("error", this.format("error", msg)));
  }
}
