/**
 * Centralized logging utility for consistent logging across the application
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4
}

interface LoggerOptions {
  /** Minimum log level to output */
  minLevel: LogLevel;
  /** Whether to include timestamps in log messages */
  timestamps: boolean;
  /** Custom prefix for all log messages */
  prefix?: string;
  /** Whether to enable debug mode with additional information */
  debug: boolean;
}

export class Logger {
  private static globalOptions: LoggerOptions = {
    minLevel: LogLevel.INFO,
    timestamps: true,
    debug: false,
  };

  private options: LoggerOptions;
  
  /**
   * Creates a new logger instance
   * 
   * @param namespace - Optional namespace for this logger instance
   * @param options - Custom options for this logger instance
   */
  constructor(
    private namespace?: string,
    options?: Partial<LoggerOptions>
  ) {
    this.options = {
      ...Logger.globalOptions,
      ...options
    };
  }

  /**
   * Configure global logger settings
   * 
   * @param options - Global options to apply to all loggers
   */
  static configure(options: Partial<LoggerOptions>): void {
    Logger.globalOptions = {
      ...Logger.globalOptions,
      ...options
    };
  }

  /**
   * Enable debug mode globally
   */
  static enableDebug(): void {
    Logger.globalOptions.minLevel = LogLevel.DEBUG;
    Logger.globalOptions.debug = true;
  }

  /**
   * Disable debug mode globally
   */
  static disableDebug(): void {
    Logger.globalOptions.minLevel = LogLevel.INFO;
    Logger.globalOptions.debug = false;
  }

  /**
   * Log a debug message
   */
  debug(message: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  /**
   * Log an info message
   */
  info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, message, ...args);
  }

  /**
   * Log a warning message
   */
  warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, message, ...args);
  }

  /**
   * Log an error message
   */
  error(message: string | Error, ...args: any[]): void {
    if (message instanceof Error) {
      this.log(
        LogLevel.ERROR,
        `${message.name}: ${message.message}`,
        ...[...args, this.options.debug ? message.stack : null].filter(Boolean)
      );
    } else {
      this.log(LogLevel.ERROR, message, ...args);
    }
  }

  /**
   * Create a child logger with a sub-namespace
   * 
   * @param subNamespace - The sub-namespace to append to the current namespace
   * @param options - Optional custom options for the child logger
   */
  child(subNamespace: string, options?: Partial<LoggerOptions>): Logger {
    const namespace = this.namespace 
      ? `${this.namespace}:${subNamespace}`
      : subNamespace;
    
    return new Logger(namespace, {
      ...this.options,
      ...options
    });
  }

  private log(level: LogLevel, message: string, ...args: any[]): void {
    if (level < this.options.minLevel) {
      return;
    }

    const timestamp = this.options.timestamps 
      ? `[${new Date().toISOString()}] `
      : '';
    
    const prefix = this.options.prefix || '';
    const namespace = this.namespace ? `[${this.namespace}] ` : '';
    const levelStr = LogLevel[level].padEnd(5);
    
    const fullPrefix = `${timestamp}${prefix}${levelStr} ${namespace}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`${fullPrefix}${message}`, ...args);
        break;
      case LogLevel.INFO:
        console.info(`${fullPrefix}${message}`, ...args);
        break;
      case LogLevel.WARN:
        console.warn(`${fullPrefix}${message}`, ...args);
        break;
      case LogLevel.ERROR:
        console.error(`${fullPrefix}${message}`, ...args);
        break;
    }
  }
}

// Default export for easy import
export default new Logger('twitter-agent');
