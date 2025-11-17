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
import { z } from 'zod';
import type { RawKanbanConfig } from './shared.js';
export const HealthThresholdSchema = z.object(stryMutAct_9fa48("294") ? {} : (stryCov_9fa48("294"), {
  wipViolation: stryMutAct_9fa48("296") ? z.number().max(0).max(100).default(80) : stryMutAct_9fa48("295") ? z.number().min(0).min(100).default(80) : (stryCov_9fa48("295", "296"), z.number().min(0).max(100).default(80)),
  dwellTime: z.object(stryMutAct_9fa48("297") ? {} : (stryCov_9fa48("297"), {
    warning: stryMutAct_9fa48("298") ? z.number().max(0).default(7) : (stryCov_9fa48("298"), z.number().min(0).default(7)),
    critical: stryMutAct_9fa48("299") ? z.number().max(0).default(14) : (stryCov_9fa48("299"), z.number().min(0).default(14))
  })),
  flowEfficiency: z.object(stryMutAct_9fa48("300") ? {} : (stryCov_9fa48("300"), {
    warning: stryMutAct_9fa48("302") ? z.number().max(0).max(100).default(60) : stryMutAct_9fa48("301") ? z.number().min(0).min(100).default(60) : (stryCov_9fa48("301", "302"), z.number().min(0).max(100).default(60)),
    critical: stryMutAct_9fa48("304") ? z.number().max(0).max(100).default(40) : stryMutAct_9fa48("303") ? z.number().min(0).min(100).default(40) : (stryCov_9fa48("303", "304"), z.number().min(0).max(100).default(40))
  })),
  throughput: z.object(stryMutAct_9fa48("305") ? {} : (stryCov_9fa48("305"), {
    warning: stryMutAct_9fa48("306") ? z.number().max(0).default(1) : (stryCov_9fa48("306"), z.number().min(0).default(1)),
    critical: stryMutAct_9fa48("307") ? z.number().max(0).default(0.5) : (stryCov_9fa48("307"), z.number().min(0).default(0.5))
  })),
  anomalySensitivity: stryMutAct_9fa48("309") ? z.number().max(0).max(1).default(0.7) : stryMutAct_9fa48("308") ? z.number().min(0).min(1).default(0.7) : (stryCov_9fa48("308", "309"), z.number().min(0).max(1).default(0.7))
}));
export const AlertChannelSchema = z.object(stryMutAct_9fa48("310") ? {} : (stryCov_9fa48("310"), {
  type: z.enum(stryMutAct_9fa48("311") ? [] : (stryCov_9fa48("311"), [stryMutAct_9fa48("312") ? "" : (stryCov_9fa48("312"), 'console'), stryMutAct_9fa48("313") ? "" : (stryCov_9fa48("313"), 'file'), stryMutAct_9fa48("314") ? "" : (stryCov_9fa48("314"), 'webhook'), stryMutAct_9fa48("315") ? "" : (stryCov_9fa48("315"), 'mcp')])),
  enabled: z.boolean().default(stryMutAct_9fa48("316") ? false : (stryCov_9fa48("316"), true)),
  config: z.record(z.any()).optional()
}));
export const HealthRuleSchema = z.object(stryMutAct_9fa48("317") ? {} : (stryCov_9fa48("317"), {
  name: z.string(),
  description: z.string().optional(),
  enabled: z.boolean().default(stryMutAct_9fa48("318") ? false : (stryCov_9fa48("318"), true)),
  severity: z.enum(stryMutAct_9fa48("319") ? [] : (stryCov_9fa48("319"), [stryMutAct_9fa48("320") ? "" : (stryCov_9fa48("320"), 'info'), stryMutAct_9fa48("321") ? "" : (stryCov_9fa48("321"), 'warning'), stryMutAct_9fa48("322") ? "" : (stryCov_9fa48("322"), 'error'), stryMutAct_9fa48("323") ? "" : (stryCov_9fa48("323"), 'critical')])).default(stryMutAct_9fa48("324") ? "" : (stryCov_9fa48("324"), 'warning')),
  condition: z.string(),
  action: z.string().optional()
}));
export const HealthMonitoringConfigSchema = z.object(stryMutAct_9fa48("325") ? {} : (stryCov_9fa48("325"), {
  enabled: z.boolean().default(stryMutAct_9fa48("326") ? false : (stryCov_9fa48("326"), true)),
  thresholds: HealthThresholdSchema.default(stryMutAct_9fa48("327") ? {} : (stryCov_9fa48("327"), {
    wipViolation: 80,
    dwellTime: stryMutAct_9fa48("328") ? {} : (stryCov_9fa48("328"), {
      warning: 7,
      critical: 14
    }),
    flowEfficiency: stryMutAct_9fa48("329") ? {} : (stryCov_9fa48("329"), {
      warning: 60,
      critical: 40
    }),
    throughput: stryMutAct_9fa48("330") ? {} : (stryCov_9fa48("330"), {
      warning: 1,
      critical: 0.5
    }),
    anomalySensitivity: 0.7
  })),
  alertChannels: z.array(AlertChannelSchema).default(stryMutAct_9fa48("331") ? [] : (stryCov_9fa48("331"), [stryMutAct_9fa48("332") ? {} : (stryCov_9fa48("332"), {
    type: stryMutAct_9fa48("333") ? "" : (stryCov_9fa48("333"), 'console'),
    enabled: stryMutAct_9fa48("334") ? false : (stryCov_9fa48("334"), true)
  }), stryMutAct_9fa48("335") ? {} : (stryCov_9fa48("335"), {
    type: stryMutAct_9fa48("336") ? "" : (stryCov_9fa48("336"), 'file'),
    enabled: stryMutAct_9fa48("337") ? false : (stryCov_9fa48("337"), true),
    config: stryMutAct_9fa48("338") ? {} : (stryCov_9fa48("338"), {
      path: stryMutAct_9fa48("339") ? "" : (stryCov_9fa48("339"), 'logs/kanban-health.log')
    })
  })])),
  rules: z.array(HealthRuleSchema).default(stryMutAct_9fa48("340") ? ["Stryker was here"] : (stryCov_9fa48("340"), [])),
  scheduling: z.object(stryMutAct_9fa48("341") ? {} : (stryCov_9fa48("341"), {
    metricsCollection: z.string().default(stryMutAct_9fa48("342") ? "" : (stryCov_9fa48("342"), '*/5 * * * *')),
    anomalyDetection: z.string().default(stryMutAct_9fa48("343") ? "" : (stryCov_9fa48("343"), '*/15 * * * *')),
    reportGeneration: z.object(stryMutAct_9fa48("344") ? {} : (stryCov_9fa48("344"), {
      daily: z.string().default(stryMutAct_9fa48("345") ? "" : (stryCov_9fa48("345"), '0 8 * * *')),
      weekly: z.string().default(stryMutAct_9fa48("346") ? "" : (stryCov_9fa48("346"), '0 8 * * 1'))
    }))
  })),
  retention: z.object(stryMutAct_9fa48("347") ? {} : (stryCov_9fa48("347"), {
    metrics: stryMutAct_9fa48("348") ? z.number().max(1).default(30) : (stryCov_9fa48("348"), z.number().min(1).default(30)),
    reports: stryMutAct_9fa48("349") ? z.number().max(1).default(90) : (stryCov_9fa48("349"), z.number().min(1).default(90)),
    logs: stryMutAct_9fa48("350") ? z.number().max(1).default(7) : (stryCov_9fa48("350"), z.number().min(1).default(7))
  }))
}));
export const EnvironmentConfigSchema = z.object(stryMutAct_9fa48("351") ? {} : (stryCov_9fa48("351"), {
  name: z.string(),
  overrides: z.record(z.any()).optional(),
  health: HealthMonitoringConfigSchema.optional()
}));
const defaultEnvironments = stryMutAct_9fa48("352") ? {} : (stryCov_9fa48("352"), {
  development: stryMutAct_9fa48("353") ? {} : (stryCov_9fa48("353"), {
    name: stryMutAct_9fa48("354") ? "" : (stryCov_9fa48("354"), 'development'),
    health: stryMutAct_9fa48("355") ? {} : (stryCov_9fa48("355"), {
      enabled: stryMutAct_9fa48("356") ? false : (stryCov_9fa48("356"), true),
      thresholds: stryMutAct_9fa48("357") ? {} : (stryCov_9fa48("357"), {
        wipViolation: 90,
        dwellTime: stryMutAct_9fa48("358") ? {} : (stryCov_9fa48("358"), {
          warning: 14,
          critical: 21
        }),
        flowEfficiency: stryMutAct_9fa48("359") ? {} : (stryCov_9fa48("359"), {
          warning: 50,
          critical: 30
        }),
        throughput: stryMutAct_9fa48("360") ? {} : (stryCov_9fa48("360"), {
          warning: 0.5,
          critical: 0.25
        }),
        anomalySensitivity: 0.8
      }),
      alertChannels: stryMutAct_9fa48("361") ? [] : (stryCov_9fa48("361"), [stryMutAct_9fa48("362") ? {} : (stryCov_9fa48("362"), {
        type: 'console' as const,
        enabled: stryMutAct_9fa48("363") ? false : (stryCov_9fa48("363"), true)
      }), stryMutAct_9fa48("364") ? {} : (stryCov_9fa48("364"), {
        type: 'file' as const,
        enabled: stryMutAct_9fa48("365") ? false : (stryCov_9fa48("365"), true),
        config: stryMutAct_9fa48("366") ? {} : (stryCov_9fa48("366"), {
          path: stryMutAct_9fa48("367") ? "" : (stryCov_9fa48("367"), 'logs/kanban-health-dev.log')
        })
      })]),
      rules: stryMutAct_9fa48("368") ? ["Stryker was here"] : (stryCov_9fa48("368"), []),
      scheduling: stryMutAct_9fa48("369") ? {} : (stryCov_9fa48("369"), {
        metricsCollection: stryMutAct_9fa48("370") ? "" : (stryCov_9fa48("370"), '*/2 * * * *'),
        anomalyDetection: stryMutAct_9fa48("371") ? "" : (stryCov_9fa48("371"), '*/5 * * * *'),
        reportGeneration: stryMutAct_9fa48("372") ? {} : (stryCov_9fa48("372"), {
          daily: stryMutAct_9fa48("373") ? "" : (stryCov_9fa48("373"), '0 9 * * *'),
          weekly: stryMutAct_9fa48("374") ? "" : (stryCov_9fa48("374"), '0 9 * * 1')
        })
      }),
      retention: stryMutAct_9fa48("375") ? {} : (stryCov_9fa48("375"), {
        metrics: 30,
        reports: 90,
        logs: 7
      })
    })
  }),
  production: stryMutAct_9fa48("376") ? {} : (stryCov_9fa48("376"), {
    name: stryMutAct_9fa48("377") ? "" : (stryCov_9fa48("377"), 'production'),
    health: stryMutAct_9fa48("378") ? {} : (stryCov_9fa48("378"), {
      enabled: stryMutAct_9fa48("379") ? false : (stryCov_9fa48("379"), true),
      thresholds: stryMutAct_9fa48("380") ? {} : (stryCov_9fa48("380"), {
        wipViolation: 70,
        dwellTime: stryMutAct_9fa48("381") ? {} : (stryCov_9fa48("381"), {
          warning: 5,
          critical: 10
        }),
        flowEfficiency: stryMutAct_9fa48("382") ? {} : (stryCov_9fa48("382"), {
          warning: 70,
          critical: 50
        }),
        throughput: stryMutAct_9fa48("383") ? {} : (stryCov_9fa48("383"), {
          warning: 2,
          critical: 1
        }),
        anomalySensitivity: 0.6
      }),
      alertChannels: stryMutAct_9fa48("384") ? [] : (stryCov_9fa48("384"), [stryMutAct_9fa48("385") ? {} : (stryCov_9fa48("385"), {
        type: 'console' as const,
        enabled: stryMutAct_9fa48("386") ? true : (stryCov_9fa48("386"), false)
      }), stryMutAct_9fa48("387") ? {} : (stryCov_9fa48("387"), {
        type: 'file' as const,
        enabled: stryMutAct_9fa48("388") ? false : (stryCov_9fa48("388"), true),
        config: stryMutAct_9fa48("389") ? {} : (stryCov_9fa48("389"), {
          path: stryMutAct_9fa48("390") ? "" : (stryCov_9fa48("390"), 'logs/kanban-health.log')
        })
      }), stryMutAct_9fa48("391") ? {} : (stryCov_9fa48("391"), {
        type: 'webhook' as const,
        enabled: stryMutAct_9fa48("392") ? true : (stryCov_9fa48("392"), false),
        config: stryMutAct_9fa48("393") ? {} : (stryCov_9fa48("393"), {
          url: process.env.HEALTH_WEBHOOK_URL
        })
      }), stryMutAct_9fa48("394") ? {} : (stryCov_9fa48("394"), {
        type: 'mcp' as const,
        enabled: stryMutAct_9fa48("395") ? false : (stryCov_9fa48("395"), true),
        config: stryMutAct_9fa48("396") ? {} : (stryCov_9fa48("396"), {
          bridge: stryMutAct_9fa48("397") ? "" : (stryCov_9fa48("397"), 'promethean-mcp')
        })
      })]),
      rules: stryMutAct_9fa48("398") ? ["Stryker was here"] : (stryCov_9fa48("398"), []),
      scheduling: stryMutAct_9fa48("399") ? {} : (stryCov_9fa48("399"), {
        metricsCollection: stryMutAct_9fa48("400") ? "" : (stryCov_9fa48("400"), '*/5 * * * *'),
        anomalyDetection: stryMutAct_9fa48("401") ? "" : (stryCov_9fa48("401"), '*/15 * * * *'),
        reportGeneration: stryMutAct_9fa48("402") ? {} : (stryCov_9fa48("402"), {
          daily: stryMutAct_9fa48("403") ? "" : (stryCov_9fa48("403"), '0 6 * * *'),
          weekly: stryMutAct_9fa48("404") ? "" : (stryCov_9fa48("404"), '0 6 * * 1')
        })
      }),
      retention: stryMutAct_9fa48("405") ? {} : (stryCov_9fa48("405"), {
        metrics: 30,
        reports: 90,
        logs: 7
      })
    })
  })
});
export const KanbanHealthConfigSchema = z.object(stryMutAct_9fa48("406") ? {} : (stryCov_9fa48("406"), {
  environments: z.record(EnvironmentConfigSchema).default(defaultEnvironments),
  version: z.string().default(stryMutAct_9fa48("407") ? "" : (stryCov_9fa48("407"), '1.0.0')),
  schema: z.string().default(stryMutAct_9fa48("408") ? "" : (stryCov_9fa48("408"), 'health-config-v1'))
}));
export type HealthThreshold = z.infer<typeof HealthThresholdSchema>;
export type AlertChannel = z.infer<typeof AlertChannelSchema>;
export type HealthRule = z.infer<typeof HealthRuleSchema>;
export type HealthMonitoringConfig = z.infer<typeof HealthMonitoringConfigSchema>;
export type EnvironmentConfig = z.infer<typeof EnvironmentConfigSchema>;
export type KanbanHealthConfig = z.infer<typeof KanbanHealthConfigSchema>;
export interface ExtendedKanbanConfig extends RawKanbanConfig {
  health?: KanbanHealthConfig;
  environment?: string;
}
export const DEFAULT_HEALTH_CONFIG: HealthMonitoringConfig = stryMutAct_9fa48("409") ? {} : (stryCov_9fa48("409"), {
  enabled: stryMutAct_9fa48("410") ? false : (stryCov_9fa48("410"), true),
  thresholds: stryMutAct_9fa48("411") ? {} : (stryCov_9fa48("411"), {
    wipViolation: 80,
    dwellTime: stryMutAct_9fa48("412") ? {} : (stryCov_9fa48("412"), {
      warning: 7,
      critical: 14
    }),
    flowEfficiency: stryMutAct_9fa48("413") ? {} : (stryCov_9fa48("413"), {
      warning: 60,
      critical: 40
    }),
    throughput: stryMutAct_9fa48("414") ? {} : (stryCov_9fa48("414"), {
      warning: 1,
      critical: 0.5
    }),
    anomalySensitivity: 0.7
  }),
  alertChannels: stryMutAct_9fa48("415") ? [] : (stryCov_9fa48("415"), [stryMutAct_9fa48("416") ? {} : (stryCov_9fa48("416"), {
    type: stryMutAct_9fa48("417") ? "" : (stryCov_9fa48("417"), 'console'),
    enabled: stryMutAct_9fa48("418") ? false : (stryCov_9fa48("418"), true)
  }), stryMutAct_9fa48("419") ? {} : (stryCov_9fa48("419"), {
    type: stryMutAct_9fa48("420") ? "" : (stryCov_9fa48("420"), 'file'),
    enabled: stryMutAct_9fa48("421") ? false : (stryCov_9fa48("421"), true),
    config: stryMutAct_9fa48("422") ? {} : (stryCov_9fa48("422"), {
      path: stryMutAct_9fa48("423") ? "" : (stryCov_9fa48("423"), 'logs/kanban-health.log')
    })
  })]),
  rules: stryMutAct_9fa48("424") ? [] : (stryCov_9fa48("424"), [stryMutAct_9fa48("425") ? {} : (stryCov_9fa48("425"), {
    name: stryMutAct_9fa48("426") ? "" : (stryCov_9fa48("426"), 'wip-limit-violation'),
    description: stryMutAct_9fa48("427") ? "" : (stryCov_9fa48("427"), 'Detect WIP limit violations'),
    enabled: stryMutAct_9fa48("428") ? false : (stryCov_9fa48("428"), true),
    severity: stryMutAct_9fa48("429") ? "" : (stryCov_9fa48("429"), 'warning'),
    condition: stryMutAct_9fa48("430") ? "" : (stryCov_9fa48("430"), 'column.wip > column.limit'),
    action: stryMutAct_9fa48("431") ? "" : (stryCov_9fa48("431"), 'log-warning')
  }), stryMutAct_9fa48("432") ? {} : (stryCov_9fa48("432"), {
    name: stryMutAct_9fa48("433") ? "" : (stryCov_9fa48("433"), 'excessive-dwell-time'),
    description: stryMutAct_9fa48("434") ? "" : (stryCov_9fa48("434"), 'Detect tasks stuck too long'),
    enabled: stryMutAct_9fa48("435") ? false : (stryCov_9fa48("435"), true),
    severity: stryMutAct_9fa48("436") ? "" : (stryCov_9fa48("436"), 'error'),
    condition: stryMutAct_9fa48("437") ? "" : (stryCov_9fa48("437"), 'task.dwellTime > thresholds.dwellTime.critical'),
    action: stryMutAct_9fa48("438") ? "" : (stryCov_9fa48("438"), 'escalate-alert')
  })]),
  scheduling: stryMutAct_9fa48("439") ? {} : (stryCov_9fa48("439"), {
    metricsCollection: stryMutAct_9fa48("440") ? "" : (stryCov_9fa48("440"), '*/5 * * * *'),
    anomalyDetection: stryMutAct_9fa48("441") ? "" : (stryCov_9fa48("441"), '*/15 * * * *'),
    reportGeneration: stryMutAct_9fa48("442") ? {} : (stryCov_9fa48("442"), {
      daily: stryMutAct_9fa48("443") ? "" : (stryCov_9fa48("443"), '0 8 * * *'),
      weekly: stryMutAct_9fa48("444") ? "" : (stryCov_9fa48("444"), '0 8 * * 1')
    })
  }),
  retention: stryMutAct_9fa48("445") ? {} : (stryCov_9fa48("445"), {
    metrics: 30,
    reports: 90,
    logs: 7
  })
});