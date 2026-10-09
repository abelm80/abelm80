import {test} from 'node:test';
import assert from 'node:assert/strict';
import {calculate,totals} from './cost.js';
test('print costs include waste, machine, labor, markup and quantity',()=>{
const r=calculate({type:'print',grams:100,materialRate:20,hours:2,machineRate:3,laborMinutes:30,laborRate:20,waste:10,extra:1,markup:50,quantity:2});
assert.ok(Math.abs(r.cost-19.2)<1e-9);assert.ok(Math.abs(r.total-57.6)<1e-9);
});
test('laser time is converted from minutes and sheets can be fractional',()=>{
assert.equal(calculate({type:'laser',sheets:.5,materialRate:20,minutes:30,machineRate:40,quantity:1}).cost,30);
});
test('discount applied before tax, capped at subtotal',()=>{
assert.deepEqual(totals([{total:100}],10,20),{subtotal:100,discount:20,tax:8,total:88});
assert.equal(totals([{total:100}],10,200).total,0);
});
