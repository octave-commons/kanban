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
import { promises as fs } from 'node:fs';
import path from 'node:path';
const DOC_DIR_CANDIDATES = stryMutAct_9fa48("24778") ? () => undefined : (stryCov_9fa48("24778"), (() => {
  const DOC_DIR_CANDIDATES = (slug: string) => stryMutAct_9fa48("24779") ? [] : (stryCov_9fa48("24779"), [path.join(stryMutAct_9fa48("24780") ? "" : (stryCov_9fa48("24780"), 'docs'), stryMutAct_9fa48("24781") ? "" : (stryCov_9fa48("24781"), 'packages'), slug), path.join(stryMutAct_9fa48("24782") ? "" : (stryCov_9fa48("24782"), 'docs'), stryMutAct_9fa48("24783") ? "" : (stryCov_9fa48("24783"), 'services'), slug), path.join(stryMutAct_9fa48("24784") ? "" : (stryCov_9fa48("24784"), 'docs'), stryMutAct_9fa48("24785") ? "" : (stryCov_9fa48("24785"), 'libraries'), slug), path.join(stryMutAct_9fa48("24786") ? "" : (stryCov_9fa48("24786"), 'docs'), stryMutAct_9fa48("24787") ? "" : (stryCov_9fa48("24787"), 'apps'), slug)]);
  return DOC_DIR_CANDIDATES;
})());
const fileExists = async (p: string) => {
  if (stryMutAct_9fa48("24788")) {
    {}
  } else {
    stryCov_9fa48("24788");
    try {
      if (stryMutAct_9fa48("24789")) {
        {}
      } else {
        stryCov_9fa48("24789");
        await fs.stat(p);
        return stryMutAct_9fa48("24790") ? false : (stryCov_9fa48("24790"), true);
      }
    } catch {
      if (stryMutAct_9fa48("24791")) {
        {}
      } else {
        stryCov_9fa48("24791");
        return stryMutAct_9fa48("24792") ? true : (stryCov_9fa48("24792"), false);
      }
    }
  }
};
const docsExist = async (slug: string) => {
  if (stryMutAct_9fa48("24793")) {
    {}
  } else {
    stryCov_9fa48("24793");
    for (const dir of DOC_DIR_CANDIDATES(slug)) {
      if (stryMutAct_9fa48("24794")) {
        {}
      } else {
        stryCov_9fa48("24794");
        if (stryMutAct_9fa48("24796") ? false : stryMutAct_9fa48("24795") ? true : (stryCov_9fa48("24795", "24796"), await fileExists(dir))) return stryMutAct_9fa48("24797") ? {} : (stryCov_9fa48("24797"), {
          ok: true as const,
          dir
        });
      }
    }
    return stryMutAct_9fa48("24798") ? {} : (stryCov_9fa48("24798"), {
      ok: false as const
    });
  }
};
const hasSrcMarker = stryMutAct_9fa48("24799") ? () => undefined : (stryCov_9fa48("24799"), (() => {
  const hasSrcMarker = (file: string) => file.split(stryMutAct_9fa48("24800") ? "" : (stryCov_9fa48("24800"), '/')).includes(stryMutAct_9fa48("24801") ? "" : (stryCov_9fa48("24801"), 'src'));
  return hasSrcMarker;
})());
const hasCodeExt = stryMutAct_9fa48("24802") ? () => undefined : (stryCov_9fa48("24802"), (() => {
  const hasCodeExt = (file: string) => stryMutAct_9fa48("24803") ? ['.ts', '.tsx', '.js', '.mjs', '.cjs'].every(ext => file.endsWith(ext)) : (stryCov_9fa48("24803"), (stryMutAct_9fa48("24804") ? [] : (stryCov_9fa48("24804"), [stryMutAct_9fa48("24805") ? "" : (stryCov_9fa48("24805"), '.ts'), stryMutAct_9fa48("24806") ? "" : (stryCov_9fa48("24806"), '.tsx'), stryMutAct_9fa48("24807") ? "" : (stryCov_9fa48("24807"), '.js'), stryMutAct_9fa48("24808") ? "" : (stryCov_9fa48("24808"), '.mjs'), stryMutAct_9fa48("24809") ? "" : (stryCov_9fa48("24809"), '.cjs')])).some(stryMutAct_9fa48("24810") ? () => undefined : (stryCov_9fa48("24810"), ext => stryMutAct_9fa48("24811") ? file.startsWith(ext) : (stryCov_9fa48("24811"), file.endsWith(ext)))));
  return hasCodeExt;
})());
const isTestFile = stryMutAct_9fa48("24812") ? () => undefined : (stryCov_9fa48("24812"), (() => {
  const isTestFile = (file: string) => stryMutAct_9fa48("24815") ? (file.includes('/test/') || file.endsWith('.spec.ts')) && file.endsWith('.test.ts') : stryMutAct_9fa48("24814") ? false : stryMutAct_9fa48("24813") ? true : (stryCov_9fa48("24813", "24814", "24815"), (stryMutAct_9fa48("24817") ? file.includes('/test/') && file.endsWith('.spec.ts') : stryMutAct_9fa48("24816") ? false : (stryCov_9fa48("24816", "24817"), file.includes(stryMutAct_9fa48("24818") ? "" : (stryCov_9fa48("24818"), '/test/')) || (stryMutAct_9fa48("24819") ? file.startsWith('.spec.ts') : (stryCov_9fa48("24819"), file.endsWith(stryMutAct_9fa48("24820") ? "" : (stryCov_9fa48("24820"), '.spec.ts')))))) || (stryMutAct_9fa48("24821") ? file.startsWith('.test.ts') : (stryCov_9fa48("24821"), file.endsWith(stryMutAct_9fa48("24822") ? "" : (stryCov_9fa48("24822"), '.test.ts')))));
  return isTestFile;
})());
const isSrcChange = (file: string) => {
  if (stryMutAct_9fa48("24823")) {
    {}
  } else {
    stryCov_9fa48("24823");
    if (stryMutAct_9fa48("24826") ? false : stryMutAct_9fa48("24825") ? true : stryMutAct_9fa48("24824") ? file.startsWith('packages/') : (stryCov_9fa48("24824", "24825", "24826"), !(stryMutAct_9fa48("24827") ? file.endsWith('packages/') : (stryCov_9fa48("24827"), file.startsWith(stryMutAct_9fa48("24828") ? "" : (stryCov_9fa48("24828"), 'packages/')))))) return stryMutAct_9fa48("24829") ? true : (stryCov_9fa48("24829"), false);
    if (stryMutAct_9fa48("24831") ? false : stryMutAct_9fa48("24830") ? true : (stryCov_9fa48("24830", "24831"), isTestFile(file))) return stryMutAct_9fa48("24832") ? true : (stryCov_9fa48("24832"), false);
    return stryMutAct_9fa48("24835") ? hasSrcMarker(file) || hasCodeExt(file) : stryMutAct_9fa48("24834") ? false : stryMutAct_9fa48("24833") ? true : (stryCov_9fa48("24833", "24834", "24835"), hasSrcMarker(file) && hasCodeExt(file));
  }
};
const toSlug = stryMutAct_9fa48("24836") ? () => undefined : (stryCov_9fa48("24836"), (() => {
  const toSlug = (file: string): string | undefined => file.split(stryMutAct_9fa48("24837") ? "" : (stryCov_9fa48("24837"), '/'))[1];
  return toSlug;
})());
export type DocGuardOptions = {
  owner?: string;
  repo?: string;
  token?: string;
  pr?: string | number;
};
const coerceString = (value: string | number | undefined | null) => {
  if (stryMutAct_9fa48("24838")) {
    {}
  } else {
    stryCov_9fa48("24838");
    if (stryMutAct_9fa48("24841") ? typeof value !== 'number' : stryMutAct_9fa48("24840") ? false : stryMutAct_9fa48("24839") ? true : (stryCov_9fa48("24839", "24840", "24841"), typeof value === (stryMutAct_9fa48("24842") ? "" : (stryCov_9fa48("24842"), 'number')))) {
      if (stryMutAct_9fa48("24843")) {
        {}
      } else {
        stryCov_9fa48("24843");
        return Number.isFinite(value) ? String(value) : undefined;
      }
    }
    if (stryMutAct_9fa48("24846") ? typeof value !== 'string' : stryMutAct_9fa48("24845") ? false : stryMutAct_9fa48("24844") ? true : (stryCov_9fa48("24844", "24845", "24846"), typeof value === (stryMutAct_9fa48("24847") ? "" : (stryCov_9fa48("24847"), 'string')))) {
      if (stryMutAct_9fa48("24848")) {
        {}
      } else {
        stryCov_9fa48("24848");
        const trimmed = stryMutAct_9fa48("24849") ? value : (stryCov_9fa48("24849"), value.trim());
        return (stryMutAct_9fa48("24853") ? trimmed.length <= 0 : stryMutAct_9fa48("24852") ? trimmed.length >= 0 : stryMutAct_9fa48("24851") ? false : stryMutAct_9fa48("24850") ? true : (stryCov_9fa48("24850", "24851", "24852", "24853"), trimmed.length > 0)) ? trimmed : undefined;
      }
    }
    return undefined;
  }
};
const coerceNumber = (value: string | number | undefined | null) => {
  if (stryMutAct_9fa48("24854")) {
    {}
  } else {
    stryCov_9fa48("24854");
    if (stryMutAct_9fa48("24857") ? typeof value !== 'number' : stryMutAct_9fa48("24856") ? false : stryMutAct_9fa48("24855") ? true : (stryCov_9fa48("24855", "24856", "24857"), typeof value === (stryMutAct_9fa48("24858") ? "" : (stryCov_9fa48("24858"), 'number')))) {
      if (stryMutAct_9fa48("24859")) {
        {}
      } else {
        stryCov_9fa48("24859");
        return Number.isFinite(value) ? value : undefined;
      }
    }
    if (stryMutAct_9fa48("24862") ? typeof value !== 'string' : stryMutAct_9fa48("24861") ? false : stryMutAct_9fa48("24860") ? true : (stryCov_9fa48("24860", "24861", "24862"), typeof value === (stryMutAct_9fa48("24863") ? "" : (stryCov_9fa48("24863"), 'string')))) {
      if (stryMutAct_9fa48("24864")) {
        {}
      } else {
        stryCov_9fa48("24864");
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
      }
    }
    return undefined;
  }
};
export async function docguard(opts: DocGuardOptions) {
  if (stryMutAct_9fa48("24865")) {
    {}
  } else {
    stryCov_9fa48("24865");
    const owner = coerceString(stryMutAct_9fa48("24866") ? opts.owner && process.env.GITHUB_OWNER : (stryCov_9fa48("24866"), opts.owner ?? process.env.GITHUB_OWNER));
    const repo = coerceString(stryMutAct_9fa48("24867") ? opts.repo && process.env.GITHUB_REPO : (stryCov_9fa48("24867"), opts.repo ?? process.env.GITHUB_REPO));
    const token = coerceString(stryMutAct_9fa48("24868") ? opts.token && process.env.GITHUB_TOKEN : (stryCov_9fa48("24868"), opts.token ?? process.env.GITHUB_TOKEN));
    const prNum = coerceNumber(stryMutAct_9fa48("24869") ? opts.pr && process.env.PR_NUMBER : (stryCov_9fa48("24869"), opts.pr ?? process.env.PR_NUMBER));
    if (stryMutAct_9fa48("24872") ? (!owner || !repo || !token) && prNum === undefined : stryMutAct_9fa48("24871") ? false : stryMutAct_9fa48("24870") ? true : (stryCov_9fa48("24870", "24871", "24872"), (stryMutAct_9fa48("24874") ? (!owner || !repo) && !token : stryMutAct_9fa48("24873") ? false : (stryCov_9fa48("24873", "24874"), (stryMutAct_9fa48("24876") ? !owner && !repo : stryMutAct_9fa48("24875") ? false : (stryCov_9fa48("24875", "24876"), (stryMutAct_9fa48("24877") ? owner : (stryCov_9fa48("24877"), !owner)) || (stryMutAct_9fa48("24878") ? repo : (stryCov_9fa48("24878"), !repo)))) || (stryMutAct_9fa48("24879") ? token : (stryCov_9fa48("24879"), !token)))) || (stryMutAct_9fa48("24881") ? prNum !== undefined : stryMutAct_9fa48("24880") ? false : (stryCov_9fa48("24880", "24881"), prNum === undefined)))) {
      if (stryMutAct_9fa48("24882")) {
        {}
      } else {
        stryCov_9fa48("24882");
        console.log(JSON.stringify(stryMutAct_9fa48("24883") ? {} : (stryCov_9fa48("24883"), {
          ok: stryMutAct_9fa48("24884") ? true : (stryCov_9fa48("24884"), false),
          reason: stryMutAct_9fa48("24885") ? "" : (stryCov_9fa48("24885"), 'missing-env'),
          owner,
          repo,
          prNum
        })));
        process.exit(0); // don't hard-fail locally
      }
    }
    const safeOwner = owner;
    const safeRepo = repo;
    const safeToken = token;
    const safePrNum = prNum;

    // list changed files
    const filesRes = await fetch(stryMutAct_9fa48("24886") ? `` : (stryCov_9fa48("24886"), `https://api.github.com/repos/${safeOwner}/${safeRepo}/pulls/${safePrNum}/files`), stryMutAct_9fa48("24887") ? {} : (stryCov_9fa48("24887"), {
      headers: stryMutAct_9fa48("24888") ? {} : (stryCov_9fa48("24888"), {
        Authorization: stryMutAct_9fa48("24889") ? `` : (stryCov_9fa48("24889"), `Bearer ${safeToken}`),
        Accept: stryMutAct_9fa48("24890") ? "" : (stryCov_9fa48("24890"), 'application/vnd.github+json')
      })
    }));
    if (stryMutAct_9fa48("24893") ? false : stryMutAct_9fa48("24892") ? true : stryMutAct_9fa48("24891") ? filesRes.ok : (stryCov_9fa48("24891", "24892", "24893"), !filesRes.ok)) {
      if (stryMutAct_9fa48("24894")) {
        {}
      } else {
        stryCov_9fa48("24894");
        console.error(stryMutAct_9fa48("24895") ? "" : (stryCov_9fa48("24895"), 'Failed to list PR files'), filesRes.status);
        process.exit(1);
      }
    }
    const files = (await filesRes.json()) as Array<{
      filename: string;
    }>;
    const changed = files.map(stryMutAct_9fa48("24896") ? () => undefined : (stryCov_9fa48("24896"), f => f.filename));
    const pkgSrcChanges = stryMutAct_9fa48("24897") ? changed : (stryCov_9fa48("24897"), changed.filter(isSrcChange));
    const slugs = stryMutAct_9fa48("24898") ? Array.from(new Set(pkgSrcChanges.map(toSlug))) : (stryCov_9fa48("24898"), Array.from(new Set(pkgSrcChanges.map(toSlug))).filter(stryMutAct_9fa48("24899") ? () => undefined : (stryCov_9fa48("24899"), (slug): slug is string => stryMutAct_9fa48("24902") ? typeof slug === 'string' || slug.length > 0 : stryMutAct_9fa48("24901") ? false : stryMutAct_9fa48("24900") ? true : (stryCov_9fa48("24900", "24901", "24902"), (stryMutAct_9fa48("24904") ? typeof slug !== 'string' : stryMutAct_9fa48("24903") ? true : (stryCov_9fa48("24903", "24904"), typeof slug === (stryMutAct_9fa48("24905") ? "" : (stryCov_9fa48("24905"), 'string')))) && (stryMutAct_9fa48("24908") ? slug.length <= 0 : stryMutAct_9fa48("24907") ? slug.length >= 0 : stryMutAct_9fa48("24906") ? true : (stryCov_9fa48("24906", "24907", "24908"), slug.length > 0))))));

    // get labels on the PR
    const labelsRes = await fetch(stryMutAct_9fa48("24909") ? `` : (stryCov_9fa48("24909"), `https://api.github.com/repos/${safeOwner}/${safeRepo}/issues/${safePrNum}/labels`), stryMutAct_9fa48("24910") ? {} : (stryCov_9fa48("24910"), {
      headers: stryMutAct_9fa48("24911") ? {} : (stryCov_9fa48("24911"), {
        Authorization: stryMutAct_9fa48("24912") ? `` : (stryCov_9fa48("24912"), `Bearer ${safeToken}`),
        Accept: stryMutAct_9fa48("24913") ? "" : (stryCov_9fa48("24913"), 'application/vnd.github+json')
      })
    }));
    const labelsJson = labelsRes.ok ? await labelsRes.json() : stryMutAct_9fa48("24914") ? ["Stryker was here"] : (stryCov_9fa48("24914"), []);
    const labels: string[] = (stryMutAct_9fa48("24917") ? labelsJson && [] : stryMutAct_9fa48("24916") ? false : stryMutAct_9fa48("24915") ? true : (stryCov_9fa48("24915", "24916", "24917"), labelsJson || (stryMutAct_9fa48("24918") ? ["Stryker was here"] : (stryCov_9fa48("24918"), [])))).map(stryMutAct_9fa48("24919") ? () => undefined : (stryCov_9fa48("24919"), (l: any) => l.name));
    const bypass = labels.includes(stryMutAct_9fa48("24920") ? "" : (stryCov_9fa48("24920"), 'skip-docs'));
    const problems: Array<{
      slug: string;
      message: string;
    }> = stryMutAct_9fa48("24921") ? ["Stryker was here"] : (stryCov_9fa48("24921"), []);
    for (const slug of slugs) {
      if (stryMutAct_9fa48("24922")) {
        {}
      } else {
        stryCov_9fa48("24922");
        const docs = await docsExist(slug);
        if (stryMutAct_9fa48("24925") ? false : stryMutAct_9fa48("24924") ? true : stryMutAct_9fa48("24923") ? docs.ok : (stryCov_9fa48("24923", "24924", "24925"), !docs.ok)) {
          if (stryMutAct_9fa48("24926")) {
            {}
          } else {
            stryCov_9fa48("24926");
            problems.push(stryMutAct_9fa48("24927") ? {} : (stryCov_9fa48("24927"), {
              slug,
              message: stryMutAct_9fa48("24928") ? `` : (stryCov_9fa48("24928"), `No docs folder found for package '${slug}'. Expected one of: ${DOC_DIR_CANDIDATES(slug).join(stryMutAct_9fa48("24929") ? "" : (stryCov_9fa48("24929"), ', '))}`)
            }));
            continue;
          }
        }
        const {
          dir: docDir
        } = docs;
        // Did any doc files change in this PR?
        const docTouched = stryMutAct_9fa48("24930") ? changed.every(p => p.startsWith(docDir + '/')) : (stryCov_9fa48("24930"), changed.some(stryMutAct_9fa48("24931") ? () => undefined : (stryCov_9fa48("24931"), p => stryMutAct_9fa48("24932") ? p.endsWith(docDir + '/') : (stryCov_9fa48("24932"), p.startsWith(docDir + (stryMutAct_9fa48("24933") ? "" : (stryCov_9fa48("24933"), '/')))))));
        if (stryMutAct_9fa48("24936") ? false : stryMutAct_9fa48("24935") ? true : stryMutAct_9fa48("24934") ? docTouched : (stryCov_9fa48("24934", "24935", "24936"), !docTouched)) {
          if (stryMutAct_9fa48("24937")) {
            {}
          } else {
            stryCov_9fa48("24937");
            problems.push(stryMutAct_9fa48("24938") ? {} : (stryCov_9fa48("24938"), {
              slug,
              message: stryMutAct_9fa48("24939") ? `` : (stryCov_9fa48("24939"), `Package '${slug}' source changed without docs change in '${docDir}'. Add a note or update diagrams, or label PR with 'skip-docs'.`)
            }));
          }
        }
      }
    }
    const ok = stryMutAct_9fa48("24942") ? bypass && problems.length === 0 : stryMutAct_9fa48("24941") ? false : stryMutAct_9fa48("24940") ? true : (stryCov_9fa48("24940", "24941", "24942"), bypass || (stryMutAct_9fa48("24944") ? problems.length !== 0 : stryMutAct_9fa48("24943") ? false : (stryCov_9fa48("24943", "24944"), problems.length === 0)));
    const result = stryMutAct_9fa48("24945") ? {} : (stryCov_9fa48("24945"), {
      ok,
      bypass,
      problems,
      packages: slugs,
      changed
    });
    console.log(JSON.stringify(result));
    if (stryMutAct_9fa48("24948") ? false : stryMutAct_9fa48("24947") ? true : stryMutAct_9fa48("24946") ? ok : (stryCov_9fa48("24946", "24947", "24948"), !ok)) process.exit(1);
  }
}
if (stryMutAct_9fa48("24951") ? import.meta.url !== `file://${process.argv[1]}` : stryMutAct_9fa48("24950") ? false : stryMutAct_9fa48("24949") ? true : (stryCov_9fa48("24949", "24950", "24951"), import.meta.url === (stryMutAct_9fa48("24952") ? `` : (stryCov_9fa48("24952"), `file://${process.argv[1]}`)))) {
  if (stryMutAct_9fa48("24953")) {
    {}
  } else {
    stryCov_9fa48("24953");
    const prArg = stryMutAct_9fa48("24954") ? process.argv[0] : (stryCov_9fa48("24954"), process.argv.slice(2)[0]);
    docguard(stryMutAct_9fa48("24955") ? {} : (stryCov_9fa48("24955"), {
      pr: prArg
    })).catch(e => {
      if (stryMutAct_9fa48("24956")) {
        {}
      } else {
        stryCov_9fa48("24956");
        console.error(e);
        process.exit(1);
      }
    });
  }
}