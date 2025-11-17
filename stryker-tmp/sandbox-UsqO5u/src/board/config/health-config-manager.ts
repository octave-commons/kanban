// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync, watch } from 'node:fs';
import { EventEmitter } from 'node:events';
import type { KanbanHealthConfig, HealthMonitoringConfig } from './health-config.js';
import { KanbanHealthConfigSchema, DEFAULT_HEALTH_CONFIG } from './health-config.js';
export interface ConfigManagerOptions {
  configPath?: string;
  environment?: string;
  hotReload?: boolean;
}
export interface ConfigValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
export class HealthConfigManager extends EventEmitter {
  private configPath: string;
  private environment: string;
  private hotReload: boolean;
  private currentConfig: KanbanHealthConfig | null = null;
  private watcher: any = null;
  private version: string = stryMutAct_9fa48("41") ? "" : (stryCov_9fa48("41"), '1.0.0');
  constructor(options: ConfigManagerOptions = {}) {
    super();
    this.configPath = stryMutAct_9fa48("44") ? options.configPath && 'promethean.health.kanban.json' : stryMutAct_9fa48("43") ? false : stryMutAct_9fa48("42") ? true : (stryCov_9fa48("42", "43", "44"), options.configPath || (stryMutAct_9fa48("45") ? "" : (stryCov_9fa48("45"), 'promethean.health.kanban.json')));
    this.environment = stryMutAct_9fa48("48") ? (options.environment || process.env.NODE_ENV) && 'development' : stryMutAct_9fa48("47") ? false : stryMutAct_9fa48("46") ? true : (stryCov_9fa48("46", "47", "48"), (stryMutAct_9fa48("50") ? options.environment && process.env.NODE_ENV : stryMutAct_9fa48("49") ? false : (stryCov_9fa48("49", "50"), options.environment || process.env.NODE_ENV)) || (stryMutAct_9fa48("51") ? "" : (stryCov_9fa48("51"), 'development')));
    this.hotReload = stryMutAct_9fa48("52") ? options.hotReload && true : (stryCov_9fa48("52"), options.hotReload ?? (stryMutAct_9fa48("53") ? false : (stryCov_9fa48("53"), true)));
  }
  async loadConfig(): Promise<KanbanHealthConfig> {
    if (stryMutAct_9fa48("54")) {
      {}
    } else {
      stryCov_9fa48("54");
      try {
        if (stryMutAct_9fa48("55")) {
          {}
        } else {
          stryCov_9fa48("55");
          if (stryMutAct_9fa48("58") ? false : stryMutAct_9fa48("57") ? true : stryMutAct_9fa48("56") ? existsSync(this.configPath) : (stryCov_9fa48("56", "57", "58"), !existsSync(this.configPath))) {
            if (stryMutAct_9fa48("59")) {
              {}
            } else {
              stryCov_9fa48("59");
              await this.createDefaultConfig();
            }
          }
          const configData = await readFile(this.configPath, stryMutAct_9fa48("60") ? "" : (stryCov_9fa48("60"), 'utf8'));
          const parsedConfig = JSON.parse(configData);
          const validationResult = this.validateConfig(parsedConfig);
          if (stryMutAct_9fa48("63") ? false : stryMutAct_9fa48("62") ? true : stryMutAct_9fa48("61") ? validationResult.valid : (stryCov_9fa48("61", "62", "63"), !validationResult.valid)) {
            if (stryMutAct_9fa48("64")) {
              {}
            } else {
              stryCov_9fa48("64");
              throw new Error(stryMutAct_9fa48("65") ? `` : (stryCov_9fa48("65"), `Configuration validation failed: ${validationResult.errors.join(stryMutAct_9fa48("66") ? "" : (stryCov_9fa48("66"), ', '))}`));
            }
          }
          this.currentConfig = KanbanHealthConfigSchema.parse(parsedConfig);
          this.version = this.currentConfig.version;
          if (stryMutAct_9fa48("69") ? this.hotReload || !this.watcher : stryMutAct_9fa48("68") ? false : stryMutAct_9fa48("67") ? true : (stryCov_9fa48("67", "68", "69"), this.hotReload && (stryMutAct_9fa48("70") ? this.watcher : (stryCov_9fa48("70"), !this.watcher)))) {
            if (stryMutAct_9fa48("71")) {
              {}
            } else {
              stryCov_9fa48("71");
              await this.setupHotReload();
            }
          }
          this.emit(stryMutAct_9fa48("72") ? "" : (stryCov_9fa48("72"), 'configLoaded'), this.currentConfig);
          return this.currentConfig;
        }
      } catch (error) {
        if (stryMutAct_9fa48("73")) {
          {}
        } else {
          stryCov_9fa48("73");
          this.emit(stryMutAct_9fa48("74") ? "" : (stryCov_9fa48("74"), 'configError'), error);
          throw error;
        }
      }
    }
  }
  async saveConfig(config: Partial<KanbanHealthConfig>): Promise<void> {
    if (stryMutAct_9fa48("75")) {
      {}
    } else {
      stryCov_9fa48("75");
      try {
        if (stryMutAct_9fa48("76")) {
          {}
        } else {
          stryCov_9fa48("76");
          const baseConfig = stryMutAct_9fa48("79") ? this.currentConfig && (await this.getDefaultConfig()) : stryMutAct_9fa48("78") ? false : stryMutAct_9fa48("77") ? true : (stryCov_9fa48("77", "78", "79"), this.currentConfig || (await this.getDefaultConfig()));
          const mergedConfig = this.mergeConfig(baseConfig, config);
          const validationResult = this.validateConfig(mergedConfig);
          if (stryMutAct_9fa48("82") ? false : stryMutAct_9fa48("81") ? true : stryMutAct_9fa48("80") ? validationResult.valid : (stryCov_9fa48("80", "81", "82"), !validationResult.valid)) {
            if (stryMutAct_9fa48("83")) {
              {}
            } else {
              stryCov_9fa48("83");
              throw new Error(stryMutAct_9fa48("84") ? `` : (stryCov_9fa48("84"), `Configuration validation failed: ${validationResult.errors.join(stryMutAct_9fa48("85") ? "" : (stryCov_9fa48("85"), ', '))}`));
            }
          }
          const versionedConfig = stryMutAct_9fa48("86") ? {} : (stryCov_9fa48("86"), {
            ...mergedConfig,
            version: this.incrementVersion(stryMutAct_9fa48("89") ? this.currentConfig?.version && '1.0.0' : stryMutAct_9fa48("88") ? false : stryMutAct_9fa48("87") ? true : (stryCov_9fa48("87", "88", "89"), (stryMutAct_9fa48("90") ? this.currentConfig.version : (stryCov_9fa48("90"), this.currentConfig?.version)) || (stryMutAct_9fa48("91") ? "" : (stryCov_9fa48("91"), '1.0.0')))),
            lastModified: new Date().toISOString()
          });
          await writeFile(this.configPath, JSON.stringify(versionedConfig, null, 2));
          this.currentConfig = versionedConfig;
          this.version = versionedConfig.version;
          this.emit(stryMutAct_9fa48("92") ? "" : (stryCov_9fa48("92"), 'configSaved'), versionedConfig);
        }
      } catch (error) {
        if (stryMutAct_9fa48("93")) {
          {}
        } else {
          stryCov_9fa48("93");
          this.emit(stryMutAct_9fa48("94") ? "" : (stryCov_9fa48("94"), 'configError'), error);
          throw error;
        }
      }
    }
  }
  async getEnvironmentConfig(): Promise<HealthMonitoringConfig> {
    if (stryMutAct_9fa48("95")) {
      {}
    } else {
      stryCov_9fa48("95");
      const config = stryMutAct_9fa48("98") ? this.currentConfig && (await this.loadConfig()) : stryMutAct_9fa48("97") ? false : stryMutAct_9fa48("96") ? true : (stryCov_9fa48("96", "97", "98"), this.currentConfig || (await this.loadConfig()));
      const envConfig = config.environments[this.environment];
      if (stryMutAct_9fa48("101") ? false : stryMutAct_9fa48("100") ? true : stryMutAct_9fa48("99") ? envConfig : (stryCov_9fa48("99", "100", "101"), !envConfig)) {
        if (stryMutAct_9fa48("102")) {
          {}
        } else {
          stryCov_9fa48("102");
          throw new Error(stryMutAct_9fa48("103") ? `` : (stryCov_9fa48("103"), `Environment '${this.environment}' not found in configuration`));
        }
      }
      return stryMutAct_9fa48("104") ? {} : (stryCov_9fa48("104"), {
        ...DEFAULT_HEALTH_CONFIG,
        ...envConfig.health
      });
    }
  }
  async updateEnvironmentConfig(healthConfig: Partial<HealthMonitoringConfig>): Promise<void> {
    if (stryMutAct_9fa48("105")) {
      {}
    } else {
      stryCov_9fa48("105");
      const config = stryMutAct_9fa48("108") ? this.currentConfig && (await this.loadConfig()) : stryMutAct_9fa48("107") ? false : stryMutAct_9fa48("106") ? true : (stryCov_9fa48("106", "107", "108"), this.currentConfig || (await this.loadConfig()));
      const currentEnvConfig = config.environments[this.environment];
      const currentHealthConfig = stryMutAct_9fa48("111") ? currentEnvConfig?.health && DEFAULT_HEALTH_CONFIG : stryMutAct_9fa48("110") ? false : stryMutAct_9fa48("109") ? true : (stryCov_9fa48("109", "110", "111"), (stryMutAct_9fa48("112") ? currentEnvConfig.health : (stryCov_9fa48("112"), currentEnvConfig?.health)) || DEFAULT_HEALTH_CONFIG);
      const updatedEnvironments = stryMutAct_9fa48("113") ? {} : (stryCov_9fa48("113"), {
        ...config.environments
      });
      updatedEnvironments[this.environment] = stryMutAct_9fa48("114") ? {} : (stryCov_9fa48("114"), {
        name: this.environment,
        health: stryMutAct_9fa48("115") ? {} : (stryCov_9fa48("115"), {
          ...currentHealthConfig,
          ...healthConfig
        })
      });
      const updatedConfig = stryMutAct_9fa48("116") ? {} : (stryCov_9fa48("116"), {
        ...config,
        environments: updatedEnvironments
      });
      await this.saveConfig(updatedConfig);
    }
  }
  validateConfig(config: any): ConfigValidationResult {
    if (stryMutAct_9fa48("117")) {
      {}
    } else {
      stryCov_9fa48("117");
      const errors: string[] = stryMutAct_9fa48("118") ? ["Stryker was here"] : (stryCov_9fa48("118"), []);
      const warnings: string[] = stryMutAct_9fa48("119") ? ["Stryker was here"] : (stryCov_9fa48("119"), []);
      try {
        if (stryMutAct_9fa48("120")) {
          {}
        } else {
          stryCov_9fa48("120");
          KanbanHealthConfigSchema.parse(config);
        }
      } catch (error) {
        if (stryMutAct_9fa48("121")) {
          {}
        } else {
          stryCov_9fa48("121");
          if (stryMutAct_9fa48("123") ? false : stryMutAct_9fa48("122") ? true : (stryCov_9fa48("122", "123"), error instanceof Error)) {
            if (stryMutAct_9fa48("124")) {
              {}
            } else {
              stryCov_9fa48("124");
              errors.push(error.message);
            }
          }
        }
      }
      if (stryMutAct_9fa48("127") ? !config.environments && !config.environments[this.environment] : stryMutAct_9fa48("126") ? false : stryMutAct_9fa48("125") ? true : (stryCov_9fa48("125", "126", "127"), (stryMutAct_9fa48("128") ? config.environments : (stryCov_9fa48("128"), !config.environments)) || (stryMutAct_9fa48("129") ? config.environments[this.environment] : (stryCov_9fa48("129"), !config.environments[this.environment])))) {
        if (stryMutAct_9fa48("130")) {
          {}
        } else {
          stryCov_9fa48("130");
          warnings.push(stryMutAct_9fa48("131") ? `` : (stryCov_9fa48("131"), `Environment '${this.environment}' not configured, using defaults`));
        }
      }
      return stryMutAct_9fa48("132") ? {} : (stryCov_9fa48("132"), {
        valid: stryMutAct_9fa48("135") ? errors.length !== 0 : stryMutAct_9fa48("134") ? false : stryMutAct_9fa48("133") ? true : (stryCov_9fa48("133", "134", "135"), errors.length === 0),
        errors,
        warnings
      });
    }
  }
  async rollbackToVersion(_version: string): Promise<void> {
    if (stryMutAct_9fa48("136")) {
      {}
    } else {
      stryCov_9fa48("136");
      throw new Error(stryMutAct_9fa48("137") ? "" : (stryCov_9fa48("137"), 'Version rollback not yet implemented'));
    }
  }
  async getConfigHistory(): Promise<Array<{
    version: string;
    timestamp: string;
    description: string;
  }>> {
    if (stryMutAct_9fa48("138")) {
      {}
    } else {
      stryCov_9fa48("138");
      return stryMutAct_9fa48("139") ? ["Stryker was here"] : (stryCov_9fa48("139"), []);
    }
  }
  getCurrentConfig(): KanbanHealthConfig | null {
    if (stryMutAct_9fa48("140")) {
      {}
    } else {
      stryCov_9fa48("140");
      return this.currentConfig;
    }
  }
  getEnvironment(): string {
    if (stryMutAct_9fa48("141")) {
      {}
    } else {
      stryCov_9fa48("141");
      return this.environment;
    }
  }
  getVersion(): string {
    if (stryMutAct_9fa48("142")) {
      {}
    } else {
      stryCov_9fa48("142");
      return this.version;
    }
  }
  async destroy(): Promise<void> {
    if (stryMutAct_9fa48("143")) {
      {}
    } else {
      stryCov_9fa48("143");
      this.watcher = null;
      this.removeAllListeners();
    }
  }
  private async createDefaultConfig(): Promise<void> {
    if (stryMutAct_9fa48("144")) {
      {}
    } else {
      stryCov_9fa48("144");
      const defaultConfig = this.getDefaultConfig();
      await writeFile(this.configPath, JSON.stringify(defaultConfig, null, 2));
    }
  }
  private getDefaultConfig(): KanbanHealthConfig {
    if (stryMutAct_9fa48("145")) {
      {}
    } else {
      stryCov_9fa48("145");
      return stryMutAct_9fa48("146") ? {} : (stryCov_9fa48("146"), {
        environments: stryMutAct_9fa48("147") ? {} : (stryCov_9fa48("147"), {
          [this.environment]: stryMutAct_9fa48("148") ? {} : (stryCov_9fa48("148"), {
            name: this.environment,
            health: DEFAULT_HEALTH_CONFIG
          })
        }),
        version: stryMutAct_9fa48("149") ? "" : (stryCov_9fa48("149"), '1.0.0'),
        schema: stryMutAct_9fa48("150") ? "" : (stryCov_9fa48("150"), 'health-config-v1')
      });
    }
  }
  private mergeConfig(base: KanbanHealthConfig, update: Partial<KanbanHealthConfig>): KanbanHealthConfig {
    if (stryMutAct_9fa48("151")) {
      {}
    } else {
      stryCov_9fa48("151");
      return stryMutAct_9fa48("152") ? {} : (stryCov_9fa48("152"), {
        ...base,
        ...update,
        environments: stryMutAct_9fa48("153") ? {} : (stryCov_9fa48("153"), {
          ...base.environments,
          ...(stryMutAct_9fa48("156") ? update.environments && {} : stryMutAct_9fa48("155") ? false : stryMutAct_9fa48("154") ? true : (stryCov_9fa48("154", "155", "156"), update.environments || {}))
        })
      });
    }
  }
  private incrementVersion(currentVersion: string): string {
    if (stryMutAct_9fa48("157")) {
      {}
    } else {
      stryCov_9fa48("157");
      const [major, minor, patch] = currentVersion.split(stryMutAct_9fa48("158") ? "" : (stryCov_9fa48("158"), '.')).map(Number);
      const patchNum = stryMutAct_9fa48("161") ? patch && 0 : stryMutAct_9fa48("160") ? false : stryMutAct_9fa48("159") ? true : (stryCov_9fa48("159", "160", "161"), patch || 0);
      return stryMutAct_9fa48("162") ? `` : (stryCov_9fa48("162"), `${major}.${minor}.${stryMutAct_9fa48("163") ? patchNum - 1 : (stryCov_9fa48("163"), patchNum + 1)}`);
    }
  }
  private async setupHotReload(): Promise<void> {
    if (stryMutAct_9fa48("164")) {
      {}
    } else {
      stryCov_9fa48("164");
      try {
        if (stryMutAct_9fa48("165")) {
          {}
        } else {
          stryCov_9fa48("165");
          this.watcher = watch(this.configPath, eventType => {
            if (stryMutAct_9fa48("166")) {
              {}
            } else {
              stryCov_9fa48("166");
              if (stryMutAct_9fa48("169") ? eventType !== 'change' : stryMutAct_9fa48("168") ? false : stryMutAct_9fa48("167") ? true : (stryCov_9fa48("167", "168", "169"), eventType === (stryMutAct_9fa48("170") ? "" : (stryCov_9fa48("170"), 'change')))) {
                if (stryMutAct_9fa48("171")) {
                  {}
                } else {
                  stryCov_9fa48("171");
                  (async () => {
                    if (stryMutAct_9fa48("172")) {
                      {}
                    } else {
                      stryCov_9fa48("172");
                      try {
                        if (stryMutAct_9fa48("173")) {
                          {}
                        } else {
                          stryCov_9fa48("173");
                          await this.loadConfig();
                          this.emit(stryMutAct_9fa48("174") ? "" : (stryCov_9fa48("174"), 'configReloaded'), this.currentConfig);
                        }
                      } catch (error) {
                        if (stryMutAct_9fa48("175")) {
                          {}
                        } else {
                          stryCov_9fa48("175");
                          this.emit(stryMutAct_9fa48("176") ? "" : (stryCov_9fa48("176"), 'configError'), error);
                        }
                      }
                    }
                  })();
                }
              }
            }
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("177")) {
          {}
        } else {
          stryCov_9fa48("177");
          this.emit(stryMutAct_9fa48("178") ? "" : (stryCov_9fa48("178"), 'configError'), error);
        }
      }
    }
  }
}
export class ConfigValidator {
  static validateThresholds(thresholds: any): ConfigValidationResult {
    if (stryMutAct_9fa48("179")) {
      {}
    } else {
      stryCov_9fa48("179");
      const errors: string[] = stryMutAct_9fa48("180") ? ["Stryker was here"] : (stryCov_9fa48("180"), []);
      const warnings: string[] = stryMutAct_9fa48("181") ? ["Stryker was here"] : (stryCov_9fa48("181"), []);
      if (stryMutAct_9fa48("184") ? (typeof thresholds.wipViolation !== 'number' || thresholds.wipViolation < 0) && thresholds.wipViolation > 100 : stryMutAct_9fa48("183") ? false : stryMutAct_9fa48("182") ? true : (stryCov_9fa48("182", "183", "184"), (stryMutAct_9fa48("186") ? typeof thresholds.wipViolation !== 'number' && thresholds.wipViolation < 0 : stryMutAct_9fa48("185") ? false : (stryCov_9fa48("185", "186"), (stryMutAct_9fa48("188") ? typeof thresholds.wipViolation === 'number' : stryMutAct_9fa48("187") ? false : (stryCov_9fa48("187", "188"), typeof thresholds.wipViolation !== (stryMutAct_9fa48("189") ? "" : (stryCov_9fa48("189"), 'number')))) || (stryMutAct_9fa48("192") ? thresholds.wipViolation >= 0 : stryMutAct_9fa48("191") ? thresholds.wipViolation <= 0 : stryMutAct_9fa48("190") ? false : (stryCov_9fa48("190", "191", "192"), thresholds.wipViolation < 0)))) || (stryMutAct_9fa48("195") ? thresholds.wipViolation <= 100 : stryMutAct_9fa48("194") ? thresholds.wipViolation >= 100 : stryMutAct_9fa48("193") ? false : (stryCov_9fa48("193", "194", "195"), thresholds.wipViolation > 100)))) {
        if (stryMutAct_9fa48("196")) {
          {}
        } else {
          stryCov_9fa48("196");
          errors.push(stryMutAct_9fa48("197") ? "" : (stryCov_9fa48("197"), 'wipViolation must be a number between 0 and 100'));
        }
      }
      if (stryMutAct_9fa48("199") ? false : stryMutAct_9fa48("198") ? true : (stryCov_9fa48("198", "199"), thresholds.dwellTime)) {
        if (stryMutAct_9fa48("200")) {
          {}
        } else {
          stryCov_9fa48("200");
          if (stryMutAct_9fa48("203") ? typeof thresholds.dwellTime.warning !== 'number' && thresholds.dwellTime.warning < 0 : stryMutAct_9fa48("202") ? false : stryMutAct_9fa48("201") ? true : (stryCov_9fa48("201", "202", "203"), (stryMutAct_9fa48("205") ? typeof thresholds.dwellTime.warning === 'number' : stryMutAct_9fa48("204") ? false : (stryCov_9fa48("204", "205"), typeof thresholds.dwellTime.warning !== (stryMutAct_9fa48("206") ? "" : (stryCov_9fa48("206"), 'number')))) || (stryMutAct_9fa48("209") ? thresholds.dwellTime.warning >= 0 : stryMutAct_9fa48("208") ? thresholds.dwellTime.warning <= 0 : stryMutAct_9fa48("207") ? false : (stryCov_9fa48("207", "208", "209"), thresholds.dwellTime.warning < 0)))) {
            if (stryMutAct_9fa48("210")) {
              {}
            } else {
              stryCov_9fa48("210");
              errors.push(stryMutAct_9fa48("211") ? "" : (stryCov_9fa48("211"), 'dwellTime.warning must be a positive number'));
            }
          }
          if (stryMutAct_9fa48("214") ? typeof thresholds.dwellTime.critical !== 'number' && thresholds.dwellTime.critical < 0 : stryMutAct_9fa48("213") ? false : stryMutAct_9fa48("212") ? true : (stryCov_9fa48("212", "213", "214"), (stryMutAct_9fa48("216") ? typeof thresholds.dwellTime.critical === 'number' : stryMutAct_9fa48("215") ? false : (stryCov_9fa48("215", "216"), typeof thresholds.dwellTime.critical !== (stryMutAct_9fa48("217") ? "" : (stryCov_9fa48("217"), 'number')))) || (stryMutAct_9fa48("220") ? thresholds.dwellTime.critical >= 0 : stryMutAct_9fa48("219") ? thresholds.dwellTime.critical <= 0 : stryMutAct_9fa48("218") ? false : (stryCov_9fa48("218", "219", "220"), thresholds.dwellTime.critical < 0)))) {
            if (stryMutAct_9fa48("221")) {
              {}
            } else {
              stryCov_9fa48("221");
              errors.push(stryMutAct_9fa48("222") ? "" : (stryCov_9fa48("222"), 'dwellTime.critical must be a positive number'));
            }
          }
          if (stryMutAct_9fa48("226") ? thresholds.dwellTime.warning < thresholds.dwellTime.critical : stryMutAct_9fa48("225") ? thresholds.dwellTime.warning > thresholds.dwellTime.critical : stryMutAct_9fa48("224") ? false : stryMutAct_9fa48("223") ? true : (stryCov_9fa48("223", "224", "225", "226"), thresholds.dwellTime.warning >= thresholds.dwellTime.critical)) {
            if (stryMutAct_9fa48("227")) {
              {}
            } else {
              stryCov_9fa48("227");
              warnings.push(stryMutAct_9fa48("228") ? "" : (stryCov_9fa48("228"), 'dwellTime.warning should be less than dwellTime.critical'));
            }
          }
        }
      }
      return stryMutAct_9fa48("229") ? {} : (stryCov_9fa48("229"), {
        valid: stryMutAct_9fa48("232") ? errors.length !== 0 : stryMutAct_9fa48("231") ? false : stryMutAct_9fa48("230") ? true : (stryCov_9fa48("230", "231", "232"), errors.length === 0),
        errors,
        warnings
      });
    }
  }
  static validateScheduling(scheduling: any): ConfigValidationResult {
    if (stryMutAct_9fa48("233")) {
      {}
    } else {
      stryCov_9fa48("233");
      const errors: string[] = stryMutAct_9fa48("234") ? ["Stryker was here"] : (stryCov_9fa48("234"), []);
      const warnings: string[] = stryMutAct_9fa48("235") ? ["Stryker was here"] : (stryCov_9fa48("235"), []);
      const cronRegex = stryMutAct_9fa48("262") ? /^(\*|[0-5]?\d|\*\/\d+) (\*|[01]?\d|2[0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\d+) (\*|[01]?\d|\*\/\d+) (\*|[0-6]|\*\/\D+)$/ : stryMutAct_9fa48("261") ? /^(\*|[0-5]?\d|\*\/\d+) (\*|[01]?\d|2[0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\d+) (\*|[01]?\d|\*\/\d+) (\*|[0-6]|\*\/\d)$/ : stryMutAct_9fa48("260") ? /^(\*|[0-5]?\d|\*\/\d+) (\*|[01]?\d|2[0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\d+) (\*|[01]?\d|\*\/\d+) (\*|[^0-6]|\*\/\d+)$/ : stryMutAct_9fa48("259") ? /^(\*|[0-5]?\d|\*\/\d+) (\*|[01]?\d|2[0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\d+) (\*|[01]?\d|\*\/\D+) (\*|[0-6]|\*\/\d+)$/ : stryMutAct_9fa48("258") ? /^(\*|[0-5]?\d|\*\/\d+) (\*|[01]?\d|2[0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\d+) (\*|[01]?\d|\*\/\d) (\*|[0-6]|\*\/\d+)$/ : stryMutAct_9fa48("257") ? /^(\*|[0-5]?\d|\*\/\d+) (\*|[01]?\d|2[0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\d+) (\*|[01]?\D|\*\/\d+) (\*|[0-6]|\*\/\d+)$/ : stryMutAct_9fa48("256") ? /^(\*|[0-5]?\d|\*\/\d+) (\*|[01]?\d|2[0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\d+) (\*|[^01]?\d|\*\/\d+) (\*|[0-6]|\*\/\d+)$/ : stryMutAct_9fa48("255") ? /^(\*|[0-5]?\d|\*\/\d+) (\*|[01]?\d|2[0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\d+) (\*|[01]\d|\*\/\d+) (\*|[0-6]|\*\/\d+)$/ : stryMutAct_9fa48("254") ? /^(\*|[0-5]?\d|\*\/\d+) (\*|[01]?\d|2[0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\D+) (\*|[01]?\d|\*\/\d+) (\*|[0-6]|\*\/\d+)$/ : stryMutAct_9fa48("253") ? /^(\*|[0-5]?\d|\*\/\d+) (\*|[01]?\d|2[0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\d) (\*|[01]?\d|\*\/\d+) (\*|[0-6]|\*\/\d+)$/ : stryMutAct_9fa48("252") ? /^(\*|[0-5]?\d|\*\/\d+) (\*|[01]?\d|2[0-3]|\*\/\d+) (\*|[12]?\d|3[^01]|\*\/\d+) (\*|[01]?\d|\*\/\d+) (\*|[0-6]|\*\/\d+)$/ : stryMutAct_9fa48("251") ? /^(\*|[0-5]?\d|\*\/\d+) (\*|[01]?\d|2[0-3]|\*\/\d+) (\*|[12]?\D|3[01]|\*\/\d+) (\*|[01]?\d|\*\/\d+) (\*|[0-6]|\*\/\d+)$/ : stryMutAct_9fa48("250") ? /^(\*|[0-5]?\d|\*\/\d+) (\*|[01]?\d|2[0-3]|\*\/\d+) (\*|[^12]?\d|3[01]|\*\/\d+) (\*|[01]?\d|\*\/\d+) (\*|[0-6]|\*\/\d+)$/ : stryMutAct_9fa48("249") ? /^(\*|[0-5]?\d|\*\/\d+) (\*|[01]?\d|2[0-3]|\*\/\d+) (\*|[12]\d|3[01]|\*\/\d+) (\*|[01]?\d|\*\/\d+) (\*|[0-6]|\*\/\d+)$/ : stryMutAct_9fa48("248") ? /^(\*|[0-5]?\d|\*\/\d+) (\*|[01]?\d|2[0-3]|\*\/\D+) (\*|[12]?\d|3[01]|\*\/\d+) (\*|[01]?\d|\*\/\d+) (\*|[0-6]|\*\/\d+)$/ : stryMutAct_9fa48("247") ? /^(\*|[0-5]?\d|\*\/\d+) (\*|[01]?\d|2[0-3]|\*\/\d) (\*|[12]?\d|3[01]|\*\/\d+) (\*|[01]?\d|\*\/\d+) (\*|[0-6]|\*\/\d+)$/ : stryMutAct_9fa48("246") ? /^(\*|[0-5]?\d|\*\/\d+) (\*|[01]?\d|2[^0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\d+) (\*|[01]?\d|\*\/\d+) (\*|[0-6]|\*\/\d+)$/ : stryMutAct_9fa48("245") ? /^(\*|[0-5]?\d|\*\/\d+) (\*|[01]?\D|2[0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\d+) (\*|[01]?\d|\*\/\d+) (\*|[0-6]|\*\/\d+)$/ : stryMutAct_9fa48("244") ? /^(\*|[0-5]?\d|\*\/\d+) (\*|[^01]?\d|2[0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\d+) (\*|[01]?\d|\*\/\d+) (\*|[0-6]|\*\/\d+)$/ : stryMutAct_9fa48("243") ? /^(\*|[0-5]?\d|\*\/\d+) (\*|[01]\d|2[0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\d+) (\*|[01]?\d|\*\/\d+) (\*|[0-6]|\*\/\d+)$/ : stryMutAct_9fa48("242") ? /^(\*|[0-5]?\d|\*\/\D+) (\*|[01]?\d|2[0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\d+) (\*|[01]?\d|\*\/\d+) (\*|[0-6]|\*\/\d+)$/ : stryMutAct_9fa48("241") ? /^(\*|[0-5]?\d|\*\/\d) (\*|[01]?\d|2[0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\d+) (\*|[01]?\d|\*\/\d+) (\*|[0-6]|\*\/\d+)$/ : stryMutAct_9fa48("240") ? /^(\*|[0-5]?\D|\*\/\d+) (\*|[01]?\d|2[0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\d+) (\*|[01]?\d|\*\/\d+) (\*|[0-6]|\*\/\d+)$/ : stryMutAct_9fa48("239") ? /^(\*|[^0-5]?\d|\*\/\d+) (\*|[01]?\d|2[0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\d+) (\*|[01]?\d|\*\/\d+) (\*|[0-6]|\*\/\d+)$/ : stryMutAct_9fa48("238") ? /^(\*|[0-5]\d|\*\/\d+) (\*|[01]?\d|2[0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\d+) (\*|[01]?\d|\*\/\d+) (\*|[0-6]|\*\/\d+)$/ : stryMutAct_9fa48("237") ? /^(\*|[0-5]?\d|\*\/\d+) (\*|[01]?\d|2[0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\d+) (\*|[01]?\d|\*\/\d+) (\*|[0-6]|\*\/\d+)/ : stryMutAct_9fa48("236") ? /(\*|[0-5]?\d|\*\/\d+) (\*|[01]?\d|2[0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\d+) (\*|[01]?\d|\*\/\d+) (\*|[0-6]|\*\/\d+)$/ : (stryCov_9fa48("236", "237", "238", "239", "240", "241", "242", "243", "244", "245", "246", "247", "248", "249", "250", "251", "252", "253", "254", "255", "256", "257", "258", "259", "260", "261", "262"), /^(\*|[0-5]?\d|\*\/\d+) (\*|[01]?\d|2[0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\d+) (\*|[01]?\d|\*\/\d+) (\*|[0-6]|\*\/\d+)$/);
      if (stryMutAct_9fa48("265") ? scheduling.metricsCollection || !cronRegex.test(scheduling.metricsCollection) : stryMutAct_9fa48("264") ? false : stryMutAct_9fa48("263") ? true : (stryCov_9fa48("263", "264", "265"), scheduling.metricsCollection && (stryMutAct_9fa48("266") ? cronRegex.test(scheduling.metricsCollection) : (stryCov_9fa48("266"), !cronRegex.test(scheduling.metricsCollection))))) {
        if (stryMutAct_9fa48("267")) {
          {}
        } else {
          stryCov_9fa48("267");
          errors.push(stryMutAct_9fa48("268") ? "" : (stryCov_9fa48("268"), 'metricsCollection must be a valid cron expression'));
        }
      }
      if (stryMutAct_9fa48("271") ? scheduling.anomalyDetection || !cronRegex.test(scheduling.anomalyDetection) : stryMutAct_9fa48("270") ? false : stryMutAct_9fa48("269") ? true : (stryCov_9fa48("269", "270", "271"), scheduling.anomalyDetection && (stryMutAct_9fa48("272") ? cronRegex.test(scheduling.anomalyDetection) : (stryCov_9fa48("272"), !cronRegex.test(scheduling.anomalyDetection))))) {
        if (stryMutAct_9fa48("273")) {
          {}
        } else {
          stryCov_9fa48("273");
          errors.push(stryMutAct_9fa48("274") ? "" : (stryCov_9fa48("274"), 'anomalyDetection must be a valid cron expression'));
        }
      }
      if (stryMutAct_9fa48("276") ? false : stryMutAct_9fa48("275") ? true : (stryCov_9fa48("275", "276"), scheduling.reportGeneration)) {
        if (stryMutAct_9fa48("277")) {
          {}
        } else {
          stryCov_9fa48("277");
          if (stryMutAct_9fa48("280") ? scheduling.reportGeneration.daily || !cronRegex.test(scheduling.reportGeneration.daily) : stryMutAct_9fa48("279") ? false : stryMutAct_9fa48("278") ? true : (stryCov_9fa48("278", "279", "280"), scheduling.reportGeneration.daily && (stryMutAct_9fa48("281") ? cronRegex.test(scheduling.reportGeneration.daily) : (stryCov_9fa48("281"), !cronRegex.test(scheduling.reportGeneration.daily))))) {
            if (stryMutAct_9fa48("282")) {
              {}
            } else {
              stryCov_9fa48("282");
              errors.push(stryMutAct_9fa48("283") ? "" : (stryCov_9fa48("283"), 'reportGeneration.daily must be a valid cron expression'));
            }
          }
          if (stryMutAct_9fa48("286") ? scheduling.reportGeneration.weekly || !cronRegex.test(scheduling.reportGeneration.weekly) : stryMutAct_9fa48("285") ? false : stryMutAct_9fa48("284") ? true : (stryCov_9fa48("284", "285", "286"), scheduling.reportGeneration.weekly && (stryMutAct_9fa48("287") ? cronRegex.test(scheduling.reportGeneration.weekly) : (stryCov_9fa48("287"), !cronRegex.test(scheduling.reportGeneration.weekly))))) {
            if (stryMutAct_9fa48("288")) {
              {}
            } else {
              stryCov_9fa48("288");
              errors.push(stryMutAct_9fa48("289") ? "" : (stryCov_9fa48("289"), 'reportGeneration.weekly must be a valid cron expression'));
            }
          }
        }
      }
      return stryMutAct_9fa48("290") ? {} : (stryCov_9fa48("290"), {
        valid: stryMutAct_9fa48("293") ? errors.length !== 0 : stryMutAct_9fa48("292") ? false : stryMutAct_9fa48("291") ? true : (stryCov_9fa48("291", "292", "293"), errors.length === 0),
        errors,
        warnings
      });
    }
  }
}
export default HealthConfigManager;