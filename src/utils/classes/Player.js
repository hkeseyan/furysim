import Target from './Target'
import Weapon from './Weapon'
import Rage from './Rage'
import { Cooldown } from './Cooldown'
import AngerManagement from './Cooldowns/AngerManagement'
import DeathWish from './Cooldowns/DeathWish'
import BloodFury from './Cooldowns/BloodFury'
import Flurry from './Flurry'
import Bloodthirst from './Skills/Bloodthirst'
import Whirlwind from './Skills/Whirlwind'

import { parseTalents } from '../helpers'

export default class Player {
  constructor(cfg) {
    this.lvl = cfg.player.lvl
    this.str = cfg.player.str
    this._ap = cfg.player.ap
    this.hit = cfg.player.hit
    this.haste = 1 + cfg.player.haste / 100
    this.crit = cfg.player.crit

    this.target = new Target(cfg.target, cfg.player)
    this.mainhand = new Weapon(cfg.mainhand, this)
    this.offhand = cfg.offhand ? new Weapon(cfg.offhand, this, true) : null
    this.isDw = !!this.offhand
    this.rage = new Rage(this)

    // Talents
    const talents = parseTalents()
    this.heroicCost = 15 - talents.improvedHS
    this.skillCritMul = 2 + talents.impale * 0.1
    this.weaponSpecDmgMul = this.isDw ? 1 : (1 + talents.twoHandSpec * 0.01)
    this.offhandDmgMul = 0.5 + talents.dualWieldSpec * 0.025
    this.flurryHaste = 1 + (talents.flurry && (talents.flurry + 1) * 0.05) || 0
    this.angerManagement = talents.angerMgmt ? new AngerManagement(this) : null
    this.extraRageChance = talents.unbridledWrath * 0.08
    this.slamCast = 1.5 - talents.improvedSlam * 0.1
    this.executeCost = 15 - (talents.impExecute && talents.impExecute * 3 - 1) || 0

    this.gcd = new Cooldown('GCD', 1.5)
    this.bloodFury = new BloodFury(this)
    this.deathWish = new DeathWish(this)
    this.flurry = new Flurry(this)
    this.bloodthirst = new Bloodthirst(this)
    this.whirlwind = new Whirlwind(this)

    this.log = {
      timeline: [],
      totalDmg: 0,
      miss: 0,
      dodge: 0,
      glance: 0,
      crit: 0,
      hit: 0,
      skillMiss: 0,
      skillDodge: 0,
      skillCrit: 0,
      skillHit: 0
    }
  }

  // Getters

  get dmgMul() {
    if (this.deathWish.isActive) return this.weaponSpecDmgMul * 1.2

    return this.weaponSpecDmgMul
  }

  get ap() {
    const baseAp = (this.lvl * 3 - 20) + this.str * 2
    if (this.bloodFury.isActive) return baseAp * 0.25 + this._ap

    return this._ap
  }

  // Methods

  getDps(duration) {
    if (duration <= 0) return
    return Number((this.log.totalDmg / duration).toFixed(1))
  }

  addTimeline(tick, name, type, value = null) {
    const time = (tick / 1000).toFixed(3).padStart(6, '0')
    this.log.timeline.push(
      `${time}: ${name} ${type} for ${value} (${this.rage.current} rage)`
    )
    value === null
      // eslint-disable-next-line no-console
      ? console.log(tick / 1000, ':', name, type)
      // eslint-disable-next-line no-console
      : console.log(tick / 1000, ':', name, type, 'for', value, '(', this.rage.current, 'rage )')
  }
}
