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
import { HealthConfigManager } from './health-config-manager.js';
import type { HealthMonitoringConfig, KanbanHealthConfig } from './health-config.js';
export class HealthConfigAPI {
  private manager: HealthConfigManager;
  constructor(manager: HealthConfigManager) {
    if (stryMutAct_9fa48("0")) {
      {}
    } else {
      stryCov_9fa48("0");
      this.manager = manager;
    }
  }
  async getConfig(): Promise<KanbanHealthConfig> {
    if (stryMutAct_9fa48("1")) {
      {}
    } else {
      stryCov_9fa48("1");
      return stryMutAct_9fa48("4") ? this.manager.getCurrentConfig() && this.manager.loadConfig() : stryMutAct_9fa48("3") ? false : stryMutAct_9fa48("2") ? true : (stryCov_9fa48("2", "3", "4"), this.manager.getCurrentConfig() || this.manager.loadConfig());
    }
  }
  async getEnvironmentConfig(): Promise<HealthMonitoringConfig> {
    if (stryMutAct_9fa48("5")) {
      {}
    } else {
      stryCov_9fa48("5");
      return this.manager.getEnvironmentConfig();
    }
  }
  async updateThresholds(thresholds: Partial<HealthMonitoringConfig['thresholds']>): Promise<void> {
    if (stryMutAct_9fa48("6")) {
      {}
    } else {
      stryCov_9fa48("6");
      const currentConfig = await this.getEnvironmentConfig();
      const updatedThresholds = stryMutAct_9fa48("7") ? {} : (stryCov_9fa48("7"), {
        ...currentConfig.thresholds,
        ...thresholds
      });
      await this.manager.updateEnvironmentConfig(stryMutAct_9fa48("8") ? {} : (stryCov_9fa48("8"), {
        thresholds: updatedThresholds
      }));
    }
  }
  async updateAlertChannels(channels: Partial<HealthMonitoringConfig['alertChannels']>): Promise<void> {
    if (stryMutAct_9fa48("9")) {
      {}
    } else {
      stryCov_9fa48("9");
      const updatedChannels = stryMutAct_9fa48("10") ? channels : (stryCov_9fa48("10"), channels.filter(stryMutAct_9fa48("11") ? () => undefined : (stryCov_9fa48("11"), (channel): channel is NonNullable<typeof channel> => Boolean(channel))));
      await this.manager.updateEnvironmentConfig(stryMutAct_9fa48("12") ? {} : (stryCov_9fa48("12"), {
        alertChannels: updatedChannels
      }));
    }
  }
  async updateScheduling(scheduling: Partial<HealthMonitoringConfig['scheduling']>): Promise<void> {
    if (stryMutAct_9fa48("13")) {
      {}
    } else {
      stryCov_9fa48("13");
      const currentConfig = await this.getEnvironmentConfig();
      const updatedScheduling = stryMutAct_9fa48("14") ? {} : (stryCov_9fa48("14"), {
        ...currentConfig.scheduling,
        ...scheduling,
        reportGeneration: stryMutAct_9fa48("15") ? {} : (stryCov_9fa48("15"), {
          ...currentConfig.scheduling.reportGeneration,
          ...scheduling.reportGeneration
        })
      });
      await this.manager.updateEnvironmentConfig(stryMutAct_9fa48("16") ? {} : (stryCov_9fa48("16"), {
        scheduling: updatedScheduling
      }));
    }
  }
  async updateRules(rules: Partial<HealthMonitoringConfig['rules']>): Promise<void> {
    if (stryMutAct_9fa48("17")) {
      {}
    } else {
      stryCov_9fa48("17");
      const updatedRules = stryMutAct_9fa48("18") ? rules : (stryCov_9fa48("18"), rules.filter(stryMutAct_9fa48("19") ? () => undefined : (stryCov_9fa48("19"), (rule): rule is NonNullable<typeof rule> => Boolean(rule))));
      await this.manager.updateEnvironmentConfig(stryMutAct_9fa48("20") ? {} : (stryCov_9fa48("20"), {
        rules: updatedRules
      }));
    }
  }
  async updateRetention(retention: Partial<HealthMonitoringConfig['retention']>): Promise<void> {
    if (stryMutAct_9fa48("21")) {
      {}
    } else {
      stryCov_9fa48("21");
      const currentConfig = await this.getEnvironmentConfig();
      const updatedRetention = stryMutAct_9fa48("22") ? {} : (stryCov_9fa48("22"), {
        ...currentConfig.retention,
        ...retention
      });
      await this.manager.updateEnvironmentConfig(stryMutAct_9fa48("23") ? {} : (stryCov_9fa48("23"), {
        retention: updatedRetention
      }));
    }
  }
  async enableHealthMonitoring(): Promise<void> {
    if (stryMutAct_9fa48("24")) {
      {}
    } else {
      stryCov_9fa48("24");
      await this.manager.updateEnvironmentConfig(stryMutAct_9fa48("25") ? {} : (stryCov_9fa48("25"), {
        enabled: stryMutAct_9fa48("26") ? false : (stryCov_9fa48("26"), true)
      }));
    }
  }
  async disableHealthMonitoring(): Promise<void> {
    if (stryMutAct_9fa48("27")) {
      {}
    } else {
      stryCov_9fa48("27");
      await this.manager.updateEnvironmentConfig(stryMutAct_9fa48("28") ? {} : (stryCov_9fa48("28"), {
        enabled: stryMutAct_9fa48("29") ? true : (stryCov_9fa48("29"), false)
      }));
    }
  }
  async validateConfig(config: any) {
    if (stryMutAct_9fa48("30")) {
      {}
    } else {
      stryCov_9fa48("30");
      return this.manager.validateConfig(config);
    }
  }
  async reloadConfig(): Promise<KanbanHealthConfig> {
    if (stryMutAct_9fa48("31")) {
      {}
    } else {
      stryCov_9fa48("31");
      return this.manager.loadConfig();
    }
  }
  getConfigVersion(): string {
    if (stryMutAct_9fa48("32")) {
      {}
    } else {
      stryCov_9fa48("32");
      return this.manager.getVersion();
    }
  }
  getEnvironment(): string {
    if (stryMutAct_9fa48("33")) {
      {}
    } else {
      stryCov_9fa48("33");
      return this.manager.getEnvironment();
    }
  }
  onConfigChange(callback: (config: KanbanHealthConfig) => void): void {
    if (stryMutAct_9fa48("34")) {
      {}
    } else {
      stryCov_9fa48("34");
      this.manager.on(stryMutAct_9fa48("35") ? "" : (stryCov_9fa48("35"), 'configLoaded'), callback);
      this.manager.on(stryMutAct_9fa48("36") ? "" : (stryCov_9fa48("36"), 'configSaved'), callback);
      this.manager.on(stryMutAct_9fa48("37") ? "" : (stryCov_9fa48("37"), 'configReloaded'), callback);
    }
  }
  onConfigError(callback: (error: Error) => void): void {
    if (stryMutAct_9fa48("38")) {
      {}
    } else {
      stryCov_9fa48("38");
      this.manager.on(stryMutAct_9fa48("39") ? "" : (stryCov_9fa48("39"), 'configError'), callback);
    }
  }
  removeListeners(): void {
    if (stryMutAct_9fa48("40")) {
      {}
    } else {
      stryCov_9fa48("40");
      this.manager.removeAllListeners();
    }
  }
}
export default HealthConfigAPI;