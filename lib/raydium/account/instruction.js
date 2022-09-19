var we=Object.create;var B=Object.defineProperty;var Te=Object.getOwnPropertyDescriptor;var Se=Object.getOwnPropertyNames;var Le=Object.getPrototypeOf,Be=Object.prototype.hasOwnProperty;var Ne=(n,e)=>{for(var t in e)B(n,t,{get:e[t],enumerable:!0})},V=(n,e,t,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of Se(e))!Be.call(n,i)&&i!==t&&B(n,i,{get:()=>e[i],enumerable:!(o=Te(e,i))||o.enumerable});return n};var p=(n,e,t)=>(t=n!=null?we(Le(n)):{},V(e||!n||!n.__esModule?B(t,"default",{value:n,enumerable:!0}):t,n)),ke=n=>V(B({},"__esModule",{value:!0}),n);var ve={};Ne(ve,{closeAccountInstruction:()=>ye,createWSolAccountInstructions:()=>Me,initTokenAccountInstruction:()=>be,makeTransferInstruction:()=>qe});module.exports=ke(ve);var f=require("@solana/spl-token"),y=require("@solana/web3.js"),ge=p(require("bn.js"));var h=require("lodash"),I=p(require("dayjs")),G=p(require("dayjs/plugin/utc"));I.default.extend(G.default);var E=class{constructor(e){this.logLevel=e.logLevel!==void 0?e.logLevel:0,this.name=e.name}set level(e){this.logLevel=e}get time(){return(0,I.default)().utc().format("YYYY/MM/DD HH:mm:ss UTC")}get moduleName(){return this.name}isLogLevel(e){return e<=this.logLevel}error(...e){return this.isLogLevel(0)?(console.error(this.time,this.name,"sdk logger error",...e),this):this}logWithError(...e){let t=e.map(o=>typeof o=="object"?JSON.stringify(o):o).join(", ");throw new Error(t)}warning(...e){return this.isLogLevel(1)?(console.warn(this.time,this.name,"sdk logger warning",...e),this):this}info(...e){return this.isLogLevel(2)?(console.info(this.time,this.name,"sdk logger info",...e),this):this}debug(...e){return this.isLogLevel(3)?(console.debug(this.time,this.name,"sdk logger debug",...e),this):this}},z={},De={};function m(n){let e=(0,h.get)(z,n);if(!e){let t=(0,h.get)(De,n);e=new E({name:n,logLevel:t}),(0,h.set)(z,n,e)}return e}var Ce=require("@solana/web3.js"),Oe=p(require("bn.js"));var ie=p(require("big.js")),Ke=p(require("bn.js"));var c=p(require("bn.js"));var N=m("Raydium_bignumber");var We=new c.default(0),Z=new c.default(1),Ve=new c.default(2),ze=new c.default(3),Ge=new c.default(5),_e=new c.default(10),Q=new c.default(100),Je=new c.default(1e3),Xe=new c.default(1e4),J=9007199254740991;function l(n){if(n instanceof c.default)return n;if(typeof n=="string"){if(n.match(/^-?[0-9]+$/))return new c.default(n);N.logWithError(`invalid BigNumberish string: ${n}`)}return typeof n=="number"?(n%1&&N.logWithError(`BigNumberish number underflow: ${n}`),(n>=J||n<=-J)&&N.logWithError(`BigNumberish number overflow: ${n}`),new c.default(String(n))):typeof n=="bigint"?new c.default(n.toString()):(N.logWithError(`invalid BigNumberish value: ${n}`),new c.default(0))}var re=p(require("toformat")),Re=re.default,P=Re;var x=p(require("big.js")),oe=p(require("decimal.js-light"));var k=m("module/fraction"),U=P(x.default),w=P(oe.default),Ie={[0]:w.ROUND_DOWN,[1]:w.ROUND_HALF_UP,[2]:w.ROUND_UP},Ue={[0]:x.default.roundDown,[1]:x.default.roundHalfUp,[2]:x.default.roundUp},s=class{constructor(e,t=Z){this.numerator=l(e),this.denominator=l(t)}get quotient(){return this.numerator.div(this.denominator)}invert(){return new s(this.denominator,this.numerator)}add(e){let t=e instanceof s?e:new s(l(e));return this.denominator.eq(t.denominator)?new s(this.numerator.add(t.numerator),this.denominator):new s(this.numerator.mul(t.denominator).add(t.numerator.mul(this.denominator)),this.denominator.mul(t.denominator))}sub(e){let t=e instanceof s?e:new s(l(e));return this.denominator.eq(t.denominator)?new s(this.numerator.sub(t.numerator),this.denominator):new s(this.numerator.mul(t.denominator).sub(t.numerator.mul(this.denominator)),this.denominator.mul(t.denominator))}mul(e){let t=e instanceof s?e:new s(l(e));return new s(this.numerator.mul(t.numerator),this.denominator.mul(t.denominator))}div(e){let t=e instanceof s?e:new s(l(e));return new s(this.numerator.mul(t.denominator),this.denominator.mul(t.numerator))}toSignificant(e,t={groupSeparator:""},o=1){Number.isInteger(e)||k.logWithError(`${e} is not an integer.`),e<=0&&k.logWithError(`${e} is not positive.`),w.set({precision:e+1,rounding:Ie[o]});let i=new w(this.numerator.toString()).div(this.denominator.toString()).toSignificantDigits(e);return i.toFormat(i.decimalPlaces(),t)}toFixed(e,t={groupSeparator:""},o=1){return Number.isInteger(e)||k.logWithError(`${e} is not an integer.`),e<0&&k.logWithError(`${e} is negative.`),U.DP=e,U.RM=Ue[o]||1,new U(this.numerator.toString()).div(this.denominator.toString()).toFormat(e,t)}isZero(){return this.numerator.isZero()}};var dt=m("Raydium_amount"),ft=P(ie.default);var se=require("@solana/web3.js"),ae={symbol:"SOL",name:"Solana",decimals:9},d={symbol:"WSOL",name:"Wrapped SOL",mint:"So11111111111111111111111111111111111111112",decimals:9,extensions:{coingeckoId:"solana"}},bt={isQuantumSOL:!0,isLp:!1,official:!0,mint:new se.PublicKey(d.mint),decimals:9,symbol:"SOL",id:"sol",name:"solana",icon:"https://img.raydium.io/icon/So11111111111111111111111111111111111111112.png",extensions:{coingeckoId:"solana"}};var D=require("@solana/web3.js");var ce=require("@solana/spl-token"),u=require("@solana/web3.js");function K({pubkey:n,isSigner:e=!1,isWritable:t=!0}){return{pubkey:n,isWritable:t,isSigner:e}}var Pt=[K({pubkey:ce.TOKEN_PROGRAM_ID,isWritable:!1}),K({pubkey:u.SystemProgram.programId,isWritable:!1}),K({pubkey:u.SYSVAR_RENT_PUBKEY,isWritable:!1})];function me({publicKey:n,transformSol:e}){if(n instanceof u.PublicKey)return e&&n.equals(T)?ue:n;if(e&&n===T.toBase58())return ue;if(typeof n=="string")try{return new u.PublicKey(n)}catch{throw new Error("invalid public key")}throw new Error("invalid public key")}var xt=new u.PublicKey("4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"),wt=new u.PublicKey("Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS"),Tt=new u.PublicKey("SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt"),St=new u.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),Lt=new u.PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"),Bt=new u.PublicKey("mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So"),Nt=new u.PublicKey("7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj"),kt=new u.PublicKey("USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX"),Dt=new u.PublicKey("NRVwhjBQiUPYtfDT5zRBVJajzFQHaBUNtC7SNVvqRFa"),At=new u.PublicKey("ANAxByE6G2WjFp7A4NqtWYXb3mgruyzZYg3spfxe6Lbo"),Wt=new u.PublicKey("7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs"),ue=new u.PublicKey("So11111111111111111111111111111111111111112"),T=u.PublicKey.default;var C=class{constructor({mint:e,decimals:t,symbol:o="UNKNOWN",name:i="UNKNOWN",skipMint:g=!1}){if(e===T.toBase58()||e instanceof D.PublicKey&&T.equals(e)){this.decimals=d.decimals,this.symbol=d.symbol,this.name=d.name,this.mint=new D.PublicKey(d.mint);return}this.decimals=t,this.symbol=o,this.name=i,this.mint=g?D.PublicKey.default:me({publicKey:e})}equals(e){return this===e?!0:this.mint.equals(e.mint)}},b=C;b.WSOL=new C(d);var F=class{constructor({decimals:e,symbol:t="UNKNOWN",name:o="UNKNOWN"}){this.decimals=e,this.symbol=t,this.name=o}equals(e){return this===e}},O=F;O.SOL=new F(ae);var vt=new s(Q);var Jt=m("Raydium_price");var A=require("@solana/web3.js");var yn=m("Raydium_txTool");var Fe=require("@solana/web3.js");var kn=m("Raydium_accountInfo_util");var le=require("@solana/web3.js"),W=p(require("bn.js"));var r=require("@solana/buffer-layout"),M=r.Layout,pe=r.Structure;var q=r.UInt;var v=r.blob;var j=class extends M{constructor(t,o,i){super(t,i);this.blob=v(t),this.signed=o}decode(t,o=0){let i=new W.default(this.blob.decode(t,o),10,"le");return this.signed?i.fromTwos(this.span*8).clone():i}encode(t,o,i=0){return typeof t=="number"&&(t=new W.default(t)),this.signed&&(t=t.toTwos(this.span*8)),this.blob.encode(t.toArrayLike(Buffer,"le",this.span),o,i)}};function de(n){return new q(1,n)}function _(n){return new q(4,n)}function R(n){return new j(8,!1,n)}var H=class extends M{constructor(t,o,i,g){super(t.span,g);this.layout=t,this.decoder=o,this.encoder=i}decode(t,o){return this.decoder(this.layout.decode(t,o))}encode(t,o,i){return this.layout.encode(this.encoder(t),o,i)}getSpan(t,o){return this.layout.getSpan(t,o)}};function S(n){return new H(v(32),e=>new le.PublicKey(e),e=>e.toBuffer(),n)}var Y=class extends pe{decode(e,t){return super.decode(e,t)}};function fe(n,e,t){return new Y(n,e,t)}var $=fe([S("mint"),S("owner"),R("amount"),_("delegateOption"),S("delegate"),de("state"),_("isNativeOption"),R("isNative"),R("delegatedAmount"),_("closeAuthorityOption"),S("closeAuthority")]);function be(n){let{mint:e,tokenAccount:t,owner:o}=n;return(0,f.createInitializeAccountInstruction)(t,e,o)}function ye(n){let{tokenAccount:e,payer:t,multiSigners:o=[],owner:i}=n;return(0,f.createCloseAccountInstruction)(e,t,i,o)}async function Me(n){let{connection:e,amount:t,commitment:o,payer:i,owner:g,skipCloseAccount:he}=n,Pe=await e.getMinimumBalanceForRentExemption($.span,o),xe=l(t).add(new ge.default(Pe)),L=y.Keypair.generate();return{signers:[L],instructions:[y.SystemProgram.createAccount({fromPubkey:i,newAccountPubkey:L.publicKey,lamports:xe.toNumber(),space:$.span,programId:f.TOKEN_PROGRAM_ID}),be({mint:new y.PublicKey(d.mint),tokenAccount:L.publicKey,owner:g})],endInstructions:he?[]:[ye({tokenAccount:L.publicKey,payer:i,owner:g})]}}function qe({source:n,destination:e,owner:t,amount:o,multiSigners:i=[]}){return(0,f.createTransferInstruction)(n,e,t,l(o).toNumber(),i)}0&&(module.exports={closeAccountInstruction,createWSolAccountInstructions,initTokenAccountInstruction,makeTransferInstruction});
//# sourceMappingURL=instruction.js.map