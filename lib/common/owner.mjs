var e=class{constructor(i){this._owner=i}get publicKey(){return e.isKeyPair(this._owner)?this._owner.publicKey:this._owner}get signer(){return e.isKeyPair(this._owner)?this._owner:void 0}get isKeyPair(){return e.isKeyPair(this._owner)}get isPublicKey(){return e.isPublicKey(this._owner)}static isKeyPair(i){return i.secretKey!==void 0}static isPublicKey(i){return!e.isKeyPair(i)}};export{e as Owner};
//# sourceMappingURL=owner.mjs.map