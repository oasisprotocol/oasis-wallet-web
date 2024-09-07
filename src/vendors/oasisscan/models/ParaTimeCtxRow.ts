/* tslint:disable */
/* eslint-disable */
/**
 * Oasisscan API
 * https://github.com/bitcat365/oasisscan-backend#readme https://api.oasisscan.com/mainnet/swagger-ui/#/ https://api.oasisscan.com/mainnet/v2/api-docs 
 *
 * The version of the OpenAPI document: 1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface ParaTimeCtxRow
 */
export interface ParaTimeCtxRow {
    /**
     * 
     * @type {string}
     * @memberof ParaTimeCtxRow
     */
    amount: string;
    /**
     * 
     * @type {string}
     * @memberof ParaTimeCtxRow
     */
    method: ParaTimeCtxRowMethodEnum;
    /**
     * 
     * @type {string}
     * @memberof ParaTimeCtxRow
     */
    from: string;
    /**
     * 
     * @type {string}
     * @memberof ParaTimeCtxRow
     */
    to: string;
    /**
     * 
     * @type {number}
     * @memberof ParaTimeCtxRow
     */
    nonce?: number;
}

/**
* @export
* @enum {string}
*/
export enum ParaTimeCtxRowMethodEnum {
    ConsensusDeposit = 'consensus.Deposit',
    ConsensusWithdraw = 'consensus.Withdraw',
    ConsensusAccountsParameters = 'consensus_accounts.Parameters',
    ConsensusBalance = 'consensus.Balance',
    ConsensusAccount = 'consensus.Account'
}

export function ParaTimeCtxRowFromJSON(json: any): ParaTimeCtxRow {
    return ParaTimeCtxRowFromJSONTyped(json, false);
}

export function ParaTimeCtxRowFromJSONTyped(json: any, ignoreDiscriminator: boolean): ParaTimeCtxRow {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'amount': json['amount'],
        'method': json['method'],
        'from': json['from'],
        'to': json['to'],
        'nonce': !exists(json, 'nonce') ? undefined : json['nonce'],
    };
}

export function ParaTimeCtxRowToJSON(value?: ParaTimeCtxRow | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'amount': value.amount,
        'method': value.method,
        'from': value.from,
        'to': value.to,
        'nonce': value.nonce,
    };
}

