var bt=Object.defineProperty,ft=Object.defineProperties;var gt=Object.getOwnPropertyDescriptors;var j=Object.getOwnPropertySymbols;var Ae=Object.prototype.hasOwnProperty,Ne=Object.prototype.propertyIsEnumerable;var qe=(t,e,n)=>e in t?bt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n,V=(t,e)=>{for(var n in e||(e={}))Ae.call(e,n)&&qe(t,n,e[n]);if(j)for(var n of j(e))Ne.call(e,n)&&qe(t,n,e[n]);return t},G=(t,e)=>ft(t,gt(e));var _e=(t,e)=>{var n={};for(var r in t)Ae.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(t!=null&&j)for(var r of j(t))e.indexOf(r)<0&&Ne.call(t,r)&&(n[r]=t[r]);return n};import{PublicKey as De}from"@solana/web3.js";import Ee from"bn.js";var Oe=(m=>(m[m.Uninitialized=0]="Uninitialized",m[m.Initialized=1]="Initialized",m[m.Disabled=2]="Disabled",m[m.RemoveLiquidityOnly=3]="RemoveLiquidityOnly",m[m.LiquidityOnly=4]="LiquidityOnly",m[m.OrderBook=5]="OrderBook",m[m.Swap=6]="Swap",m[m.WaitingForStart=7]="WaitingForStart",m))(Oe||{}),fn=new Ee(25),gn=new Ee(1e4),We="675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",Pt=new De(We),Re="5quBtoiQqxF9Jv6KYKctB59NT3gtJD2Y65kdnB1Uev3h",xt=new De(Re),Pn={[We]:4,[Re]:5},Me={4:Pt,5:xt},Ke={4:3,5:3};import{PublicKey as It}from"@solana/web3.js";import{PublicKey as St}from"@solana/web3.js";import Fe,{isBN as Ce}from"bn.js";import{bits as kn,BitStructure as Ln,blob as ht,Blob as Tn,cstr as wn,f32 as Sn,f32be as In,f64 as Bn,f64be as qn,greedy as An,Layout as kt,ns64 as Nn,ns64be as _n,nu64 as Dn,nu64be as En,offset as On,s16 as Wn,s16be as Rn,s24 as Mn,s24be as Kn,s32 as vn,s32be as Vn,s40 as Un,s40be as Fn,s48 as Cn,s48be as Yn,s8 as Qn,seq as Lt,struct as jn,Structure as Tt,u16 as Gn,u16be as zn,u24 as Hn,u24be as Jn,u32 as Xn,u32be as $n,u40 as Zn,u40be as er,u48 as tr,u48be as nr,u8 as rr,UInt as wt,union as or,Union as ir,unionLayoutDiscriminator as sr,utf8 as ar}from"@solana/buffer-layout";var re=kt,ve=Tt;var Ve=wt;var Ue=Lt;var oe=ht;var z=class extends re{constructor(n,r,o){super(n,o);this.blob=oe(n),this.signed=r}decode(n,r=0){let o=new Fe(this.blob.decode(n,r),10,"le");return this.signed?o.fromTwos(this.span*8).clone():o}encode(n,r,o=0){return typeof n=="number"&&(n=new Fe(n)),this.signed&&(n=n.toTwos(this.span*8)),this.blob.encode(n.toArrayLike(Buffer,"le",this.span),r,o)}};function B(t){return new Ve(1,t)}function c(t){return new z(8,!1,t)}function q(t){return new z(16,!1,t)}var ie=class extends re{constructor(n,r,o,a){super(n.span,a);this.layout=n,this.decoder=r,this.encoder=o}decode(n,r){return this.decoder(this.layout.decode(n,r))}encode(n,r,o){return this.layout.encode(this.encoder(n),r,o)}getSpan(n,r){return this.layout.getSpan(n,r)}};function b(t){return new ie(oe(32),e=>new St(e),e=>e.toBuffer(),t)}var se=class extends ve{decode(e,n){return super.decode(e,n)}};function w(t,e,n){return new se(t,e,n)}function U(t,e,n){let r,o=typeof e=="number"?e:Ce(e)?e.toNumber():new Proxy(e,{get(a,i){if(!r){let u=Reflect.get(a,"count");r=Ce(u)?u.toNumber():u,Reflect.set(a,"count",r)}return Reflect.get(a,i)},set(a,i,u){return i==="count"&&(r=u),Reflect.set(a,i,u)}});return Ue(t,o,n)}var K=new It("CDSr3ssLcRB6XYPJwAfFt18MZvEZp4LjHcvzBVZ45duo"),W=5e4,Bt=w([c("x"),c("y"),c("price")]),qt=w([c("accountType"),c("status"),c("multiplier"),c("validDataCount"),U(Bt,W,"DataElement")]);function At(t,e){return[0,W-2]}function Nt(t){return[0,W-2]}function _t(t){return[0,W-2]}function Dt(t,e,n){let[r,o]=At(e,n),a=r,i=o,u=0,m=e*t.multiplier/n;for(;a<=i;){if(u=Math.floor((i+a)/2),u===0||u>=W-2)return[u,u,!1];let p=t.DataElement[u].x*t.multiplier/t.DataElement[u].y,l=t.DataElement[u-1].x*t.multiplier/t.DataElement[u-1].y,d=t.DataElement[u+1].x*t.multiplier/t.DataElement[u+1].y;if(m===p)return[u,u,!0];if(m===l)return[u-1,u-1,!0];if(m===d)return[u+1,u+1,!0];if(m<l)i=u-1;else{if(m>l&&m<p)return[u-1,u,!0];if(m>p&&m<d)return[u,u+1,!0];a=u+1}}return[u,u,!1]}function ae(t,e,n){let[r,o,a]=Dt(t,e,n);if(!a)return 0;if(r===o){let i=t.DataElement[r].x;return e*t.multiplier/i}else{let i=t.DataElement[r].x,u=t.DataElement[r].y,m=t.DataElement[o].x,p=t.DataElement[o].y,l=n*(m*u-i*p),d=i*l,g=(m-i)*(e*u-i*n)*p,y=d+g;return e*t.multiplier*l/y}}function O(t,e,n){return e*t.multiplier/n}function Qe(t,e,n){return e*n/t.multiplier}function Et(t,e){let[n,r]=Nt(e),o=n,a=r,i=0,u=e;for(;o<a;){if(i=Math.floor((a+o)/2),i<=0||i>W-2)return[i,i,!1];let m=t.DataElement[i].x,p=t.DataElement[i-1].x,l=t.DataElement[i+1].x;if(u===m)return[i,i,!0];if(u===p)return[i-1,i-1,!0];if(u===l)return[i+1,i+1,!0];if(u<p)a=i-1;else{if(u>p&&u<m)return[i-1,i,!0];if(u>m&&u<l)return[i,i+1,!0];o=i+1}}return[i,i,!1]}function Ot(t,e){let[n,r]=_t(e),o=n,a=r,i=0,u=e;for(;o<=a;){if(i=Math.floor((a+o)/2),i<=0||i>=W-2)return[i,i,!1];let m=t.DataElement[i].y,p=t.DataElement[i-1].y,l=t.DataElement[i+1].y;if(u===m)return[i,i,!0];if(u===p)return[i-1,i-1,!0];if(u===l)return[i+1,i+1,!0];if(u<l)o=i+1;else{if(u<p&&u>m)return[i-1,i,!0];if(u<m&&u>l)return[i,i+1,!0];a=i-1}}return[i,i,!1]}function je(t,e,n,r){let o=r?e+n:e-n,[a,i,u]=Et(t,o);if(!u)return[0,0,!1,u];if(a===i)return[t.DataElement[i].price,t.DataElement[i].y,!1,u];{let m=t.DataElement[a].x,p=t.DataElement[i].x,l=t.DataElement[a].price,d=t.DataElement[i].price,g=t.DataElement[a].y,y=t.DataElement[i].y;if(e>=m&&e<=p)return r?[d,y,!0,u]:[l,g,!0,u];{let L,I;return r?(L=l+(d-l)*(e-m)/(p-m),I=g-(o-m)*t.multiplier/d):(L=l+(d-l)*(e-m)/(p-m),I=y+(p-o)*t.multiplier/l),[L,I,!1,u]}}}function Wt(t,e,n,r){let o=r?e-n:e+n,[a,i,u]=Ot(t,o);if(!u)return[0,0,!1,u];if(a===i)return[t.DataElement[i].price,t.DataElement[i].x,!1,u];{let m=t.DataElement[a].x,p=t.DataElement[i].x,l=t.DataElement[a].price,d=t.DataElement[i].price,g=t.DataElement[a].y,y=t.DataElement[i].y;if(e>=y&&e<=g)return r?[d,p,!0,u]:[l,m,!0,u];{let L,I;return r?(L=l+(d-l)*(g-e)/(g-y),I=m+d*(g-o)/t.multiplier):(L=l+(d-l)*(g-e)/(g-y),I=p-l*(o-y)/t.multiplier),[L,I,!1,u]}}}function Rt(t,e){let n=je(t,e,0,!1);return n[3]?n[0]:0}function wr(t,e,n,r){let o=ae(t,e,n),a=O(t,e,o),i=O(t,n,o),u=O(t,r,o),m=!0,[p,l,d,g]=je(t,a,u,m);if(!g)return 0;if(d)return r*t.multiplier/p;{let y=i-l;return Qe(t,y,o)}}function Sr(t,e,n,r){let o=ae(t,e,n),a=O(t,e,o),i=O(t,n,o),u=O(t,r,o),m=!1,[p,l,d,g]=Wt(t,i,u,m);if(!g)return 0;if(d)return r*p/t.multiplier;{let y=a-l;return Qe(t,y,o)}}function Mt(t){let e=qt.decode(t);return{accountType:e.accountType.toNumber(),status:e.status.toNumber(),multiplier:e.multiplier.toNumber(),validDataCount:e.validDataCount.toNumber(),DataElement:e.DataElement.map(n=>({x:n.x.toNumber(),y:n.y.toNumber(),price:n.price.toNumber()}))}}function Ir(t,e,n,r){let o=Rt(t,O(t,e,ae(t,e,n)))/t.multiplier;return r?o:1/o}var Ye=class{constructor({connection:e}){this._layoutData={accountType:0,status:0,multiplier:0,validDataCount:0,DataElement:[]};this.connection=e}get stableModelData(){return this._layoutData}async initStableModelLayout(){if(this._layoutData.validDataCount===0&&this.connection){let e=await this.connection.getAccountInfo(K);e&&(this._layoutData=Mt(e==null?void 0:e.data))}}};import{OpenOrders as cn}from"@project-serum/serum";import Q from"bn.js";import{get as Ge,set as Kt}from"lodash";import He from"dayjs";import vt from"dayjs/plugin/utc";He.extend(vt);var ue=class{constructor(e){this.logLevel=e.logLevel!==void 0?e.logLevel:0,this.name=e.name}set level(e){this.logLevel=e}get time(){return He().utc().format("YYYY/MM/DD HH:mm:ss UTC")}get moduleName(){return this.name}isLogLevel(e){return e<=this.logLevel}error(...e){return this.isLogLevel(0)?(console.error(this.time,this.name,"sdk logger error",...e),this):this}logWithError(...e){let n=e.map(r=>typeof r=="object"?JSON.stringify(r):r).join(", ");throw new Error(n)}warning(...e){return this.isLogLevel(1)?(console.warn(this.time,this.name,"sdk logger warning",...e),this):this}info(...e){return this.isLogLevel(2)?(console.info(this.time,this.name,"sdk logger info",...e),this):this}debug(...e){return this.isLogLevel(3)?(console.debug(this.time,this.name,"sdk logger debug",...e),this):this}},ze={},Vt={};function k(t){let e=Ge(ze,t);if(!e){let n=Ge(Vt,t);e=new ue({name:t,logLevel:n}),Kt(ze,t,e)}return e}import{TOKEN_PROGRAM_ID as Ut}from"@solana/spl-token";import{PublicKey as T,SystemProgram as Ft,SYSVAR_RENT_PUBKEY as Ct}from"@solana/web3.js";function s({pubkey:t,isSigner:e=!1,isWritable:n=!0}){return{pubkey:t,isWritable:n,isSigner:e}}var ce=[s({pubkey:Ut,isWritable:!1}),s({pubkey:Ft.programId,isWritable:!1}),s({pubkey:Ct,isWritable:!1})];function v({publicKey:t,transformSol:e}){if(t instanceof T)return e&&t.equals(F)?Je:t;if(e&&t===F.toBase58())return Je;if(typeof t=="string")try{return new T(t)}catch{throw new Error("invalid public key")}throw new Error("invalid public key")}var Wr=new T("4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"),Rr=new T("Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS"),Mr=new T("SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt"),Kr=new T("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),vr=new T("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"),Vr=new T("mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So"),Ur=new T("7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj"),Fr=new T("USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX"),Cr=new T("NRVwhjBQiUPYtfDT5zRBVJajzFQHaBUNtC7SNVvqRFa"),Yr=new T("ANAxByE6G2WjFp7A4NqtWYXb3mgruyzZYg3spfxe6Lbo"),Qr=new T("7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs"),Je=new T("So11111111111111111111111111111111111111112"),F=T.default;import{PACKET_DATA_SIZE as Yt,PublicKey as Xe,sendAndConfirmTransaction as Jr,Transaction as me}from"@solana/web3.js";var _=k("Raydium_txTool");function Qt(t,e){t.length<1&&_.logWithError(`no instructions provided: ${t.toString()}`),e.length<1&&_.logWithError(`no signers provided:, ${e.toString()}`);let n=new me;n.recentBlockhash="11111111111111111111111111111111",n.feePayer=e[0],n.add(...t);let r=n.compileMessage().serialize();return e.length+e.length*64+r.length}async function $e(t,e,n){let r=new Xe("RaydiumSimuLateTransaction11111111111111111"),o=[],a=new me;a.feePayer=r;for(let m of e)Qt([...a.instructions,m],[r])>Yt&&(o.push(a),a=new me,a.feePayer=r),a.add(m);a.instructions.length>0&&o.push(a);let i=[];try{i=await Promise.all(o.map(m=>t.simulateTransaction(m)))}catch(m){m instanceof Error&&_.logWithError(`failed to simulate for instructions, RPC_ERROR, ${m.message}`)}let u=[];for(let m of i){let{value:p}=m;if(_.debug(`simulate result: ${JSON.stringify(m)}`),p.logs){let l=p.logs.filter(d=>d&&d.includes(n));_.debug(`filteredLog: ${JSON.stringify(u)}`),l.length||_.logWithError(` "simulate log not match keyword, keyword: ${n}`),u.push(...l)}}return u}function Ze(t,e){let n=t.match(/{["\w:,]+}/g);return!n||n.length!==1?_.logWithError(`simulate log fail to match json, keyword: ${e}`):n[0]}function A(t,e){let r=new RegExp(`"${e}":(\\d+)`,"g").exec(t);return!r||r.length!==2?_.logWithError(`simulate log fail to match key", key: ${e}`):r[1]}async function le(t,e){let[n,r]=await Xe.findProgramAddress(t,e);return{publicKey:n,nonce:r}}import $t from"big.js";import $ from"bn.js";import S from"bn.js";var H=k("Raydium_bignumber");var io=new S(0),tt=new S(1),so=new S(2),ao=new S(3),uo=new S(5),nt=new S(10),rt=new S(100),co=new S(1e3),mo=new S(1e4),et=9007199254740991;function h(t){if(t instanceof S)return t;if(typeof t=="string"){if(t.match(/^-?[0-9]+$/))return new S(t);H.logWithError(`invalid BigNumberish string: ${t}`)}return typeof t=="number"?(t%1&&H.logWithError(`BigNumberish number underflow: ${t}`),(t>=et||t<=-et)&&H.logWithError(`BigNumberish number overflow: ${t}`),new S(String(t))):typeof t=="bigint"?new S(t.toString()):(H.logWithError(`invalid BigNumberish value: ${t}`),new S(0))}import jt from"toformat";var Gt=jt,C=Gt;import X from"big.js";import Ht from"decimal.js-light";var J=k("module/fraction"),pe=C(X),Y=C(Ht),Jt={[0]:Y.ROUND_DOWN,[1]:Y.ROUND_HALF_UP,[2]:Y.ROUND_UP},Xt={[0]:X.roundDown,[1]:X.roundHalfUp,[2]:X.roundUp},f=class{constructor(e,n=tt){this.numerator=h(e),this.denominator=h(n)}get quotient(){return this.numerator.div(this.denominator)}invert(){return new f(this.denominator,this.numerator)}add(e){let n=e instanceof f?e:new f(h(e));return this.denominator.eq(n.denominator)?new f(this.numerator.add(n.numerator),this.denominator):new f(this.numerator.mul(n.denominator).add(n.numerator.mul(this.denominator)),this.denominator.mul(n.denominator))}sub(e){let n=e instanceof f?e:new f(h(e));return this.denominator.eq(n.denominator)?new f(this.numerator.sub(n.numerator),this.denominator):new f(this.numerator.mul(n.denominator).sub(n.numerator.mul(this.denominator)),this.denominator.mul(n.denominator))}mul(e){let n=e instanceof f?e:new f(h(e));return new f(this.numerator.mul(n.numerator),this.denominator.mul(n.denominator))}div(e){let n=e instanceof f?e:new f(h(e));return new f(this.numerator.mul(n.denominator),this.denominator.mul(n.numerator))}toSignificant(e,n={groupSeparator:""},r=1){Number.isInteger(e)||J.logWithError(`${e} is not an integer.`),e<=0&&J.logWithError(`${e} is not positive.`),Y.set({precision:e+1,rounding:Jt[r]});let o=new Y(this.numerator.toString()).div(this.denominator.toString()).toSignificantDigits(e);return o.toFormat(o.decimalPlaces(),n)}toFixed(e,n={groupSeparator:""},r=1){return Number.isInteger(e)||J.logWithError(`${e} is not an integer.`),e<0&&J.logWithError(`${e} is negative.`),pe.DP=e,pe.RM=Xt[r]||1,new pe(this.numerator.toString()).div(this.denominator.toString()).toFormat(e,n)}isZero(){return this.numerator.isZero()}};var Zt=k("Raydium_amount"),ot=C($t);function en(t,e){let n="0",r="0";if(t.includes(".")){let o=t.split(".");o.length===2?([n,r]=o,r=r.padEnd(e,"0")):Zt.logWithError(`invalid number string, num: ${t}`)}else n=t;return[n,r.slice(0,e)||r]}var D=class extends f{constructor(n,r,o=!0,a){let i=new $(0),u=nt.pow(new $(n.decimals));if(o)i=h(r);else{let m=new $(0),p=new $(0);if(typeof r=="string"||typeof r=="number"||typeof r=="bigint"){let[l,d]=en(r.toString(),n.decimals);m=h(l),p=h(d)}m=m.mul(u),i=m.add(p)}super(i,u);this.logger=k(a||"Amount"),this.token=n}get raw(){return this.numerator}isZero(){return this.raw.isZero()}gt(n){return this.token.equals(n.token)||this.logger.logWithError("gt token not equals"),this.raw.gt(n.raw)}lt(n){return this.token.equals(n.token)||this.logger.logWithError("lt token not equals"),this.raw.lt(n.raw)}add(n){return this.token.equals(n.token)||this.logger.logWithError("add token not equals"),new D(this.token,this.raw.add(n.raw))}subtract(n){return this.token.equals(n.token)||this.logger.logWithError("sub token not equals"),new D(this.token,this.raw.sub(n.raw))}toSignificant(n=this.token.decimals,r,o=0){return super.toSignificant(n,r,o)}toFixed(n=this.token.decimals,r,o=0){return n>this.token.decimals&&this.logger.logWithError("decimals overflow"),super.toFixed(n,r,o)}toExact(n={groupSeparator:""}){return ot.DP=this.token.decimals,new ot(this.numerator.toString()).div(this.denominator.toString()).toFormat(n)}};import{PublicKey as tn}from"@solana/web3.js";var it={symbol:"SOL",name:"Solana",decimals:9},M={symbol:"WSOL",name:"Wrapped SOL",mint:"So11111111111111111111111111111111111111112",decimals:9,extensions:{coingeckoId:"solana"}},Ro={isQuantumSOL:!0,isLp:!1,official:!0,mint:new tn(M.mint),decimals:9,symbol:"SOL",id:"sol",name:"solana",icon:"https://img.raydium.io/icon/So11111111111111111111111111111111111111112.png",extensions:{coingeckoId:"solana"}};import{PublicKey as de}from"@solana/web3.js";var ye=class{constructor({mint:e,decimals:n,symbol:r="UNKNOWN",name:o="UNKNOWN",skipMint:a=!1}){if(e===F.toBase58()||e instanceof de&&F.equals(e)){this.decimals=M.decimals,this.symbol=M.symbol,this.name=M.name,this.mint=new de(M.mint);return}this.decimals=n,this.symbol=r,this.name=o,this.mint=a?de.default:v({publicKey:e})}equals(e){return this===e?!0:this.mint.equals(e.mint)}},R=ye;R.WSOL=new ye(M);var fe=class{constructor({decimals:e,symbol:n="UNKNOWN",name:r="UNKNOWN"}){this.decimals=e,this.symbol=n,this.name=r}equals(e){return this===e}},be=fe;be.SOL=new fe(it);var Ho=new f(rt);var ri=k("Raydium_price");import{TOKEN_PROGRAM_ID as we}from"@solana/spl-token";import{SystemProgram as rn,TransactionInstruction as N}from"@solana/web3.js";var ge=w([B("instruction"),c("amountIn"),c("minAmountOut")]),Pe=w([B("instruction"),c("maxAmountIn"),c("amountOut")]),xe=w([B("instruction"),B("nonce")]),he=w([B("instruction"),B("nonce"),c("startTime")]),ke=w([c("status"),c("nonce"),c("maxOrder"),c("depth"),c("baseDecimal"),c("quoteDecimal"),c("state"),c("resetFlag"),c("minSize"),c("volMaxCutRatio"),c("amountWaveRatio"),c("baseLotSize"),c("quoteLotSize"),c("minPriceMultiplier"),c("maxPriceMultiplier"),c("systemDecimalValue"),c("minSeparateNumerator"),c("minSeparateDenominator"),c("tradeFeeNumerator"),c("tradeFeeDenominator"),c("pnlNumerator"),c("pnlDenominator"),c("swapFeeNumerator"),c("swapFeeDenominator"),c("baseNeedTakePnl"),c("quoteNeedTakePnl"),c("quoteTotalPnl"),c("baseTotalPnl"),q("quoteTotalDeposited"),q("baseTotalDeposited"),q("swapBaseInAmount"),q("swapQuoteOutAmount"),c("swapBase2QuoteFee"),q("swapQuoteInAmount"),q("swapBaseOutAmount"),c("swapQuote2BaseFee"),b("baseVault"),b("quoteVault"),b("baseMint"),b("quoteMint"),b("lpMint"),b("openOrders"),b("marketId"),b("marketProgramId"),b("targetOrders"),b("withdrawQueue"),b("lpVault"),b("owner"),c("lpReserve"),U(c(),3,"padding")]),nn=w([c("accountType"),c("status"),c("nonce"),c("maxOrder"),c("depth"),c("baseDecimal"),c("quoteDecimal"),c("state"),c("resetFlag"),c("minSize"),c("volMaxCutRatio"),c("amountWaveRatio"),c("baseLotSize"),c("quoteLotSize"),c("minPriceMultiplier"),c("maxPriceMultiplier"),c("systemDecimalsValue"),c("abortTradeFactor"),c("priceTickMultiplier"),c("priceTick"),c("minSeparateNumerator"),c("minSeparateDenominator"),c("tradeFeeNumerator"),c("tradeFeeDenominator"),c("pnlNumerator"),c("pnlDenominator"),c("swapFeeNumerator"),c("swapFeeDenominator"),c("baseNeedTakePnl"),c("quoteNeedTakePnl"),c("quoteTotalPnl"),c("baseTotalPnl"),c("poolOpenTime"),c("punishPcAmount"),c("punishCoinAmount"),c("orderbookToInitTime"),q("swapBaseInAmount"),q("swapQuoteOutAmount"),q("swapQuoteInAmount"),q("swapBaseOutAmount"),c("swapQuote2BaseFee"),c("swapBase2QuoteFee"),b("baseVault"),b("quoteVault"),b("baseMint"),b("quoteMint"),b("lpMint"),b("modelDataAccount"),b("openOrders"),b("marketId"),b("marketProgramId"),b("targetOrders"),b("owner"),U(c(),64,"padding")]),Le=w([B("instruction"),c("baseAmountIn"),c("quoteAmountIn"),c("fixedSide")]),Te=w([B("instruction"),c("amountIn")]),st={4:ke,5:nn};var Z=k("Raydium_liquidity_instruction");function Si(t){let{poolKeys:e,userKeys:n,amountIn:r,amountOut:o,fixedSide:a}=t,{version:i}=e;if(i===4||i===5){let u={poolKeys:e,userKeys:n};if(a==="in")return on(G(V({},u),{amountIn:r,minAmountOut:o}),i);if(a==="out")return sn(G(V({},u),{maxAmountIn:r,amountOut:o}),i);Z.logWithError("invalid params","params",t)}throw Z.logWithError("invalid version","poolKeys.version",i),new Error("invalid version")}function at(t){let e=w([B("instruction"),B("simulateType")]),n=Buffer.alloc(e.span);e.encode({instruction:12,simulateType:0},n);let r=[s({pubkey:t.id,isWritable:!1}),s({pubkey:t.authority,isWritable:!1}),s({pubkey:t.openOrders,isWritable:!1}),s({pubkey:t.baseVault,isWritable:!1}),s({pubkey:t.quoteVault,isWritable:!1}),s({pubkey:t.lpMint,isWritable:!1}),s({pubkey:t.marketId,isWritable:!1})];return new N({programId:t.programId,keys:r,data:n})}function on({poolKeys:t,userKeys:e,amountIn:n,minAmountOut:r},o){let a=Buffer.alloc(ge.span);ge.encode({instruction:9,amountIn:h(n),minAmountOut:h(r)},a);let i=[s({pubkey:we,isWritable:!1}),s({pubkey:t.id}),s({pubkey:t.authority,isWritable:!1}),s({pubkey:t.openOrders})];return o===4&&i.push(s({pubkey:t.targetOrders})),i.push(s({pubkey:t.baseVault}),s({pubkey:t.quoteVault})),o===5&&i.push(s({pubkey:K})),i.push(s({pubkey:t.marketProgramId,isWritable:!1}),s({pubkey:t.marketId}),s({pubkey:t.marketBids}),s({pubkey:t.marketAsks}),s({pubkey:t.marketEventQueue}),s({pubkey:t.marketBaseVault}),s({pubkey:t.marketQuoteVault}),s({pubkey:t.marketAuthority,isWritable:!1}),s({pubkey:e.tokenAccountIn}),s({pubkey:e.tokenAccountOut}),s({pubkey:e.owner,isWritable:!1})),new N({programId:t.programId,keys:i,data:a})}function sn({poolKeys:t,userKeys:e,maxAmountIn:n,amountOut:r},o){let a=Buffer.alloc(Pe.span);Pe.encode({instruction:11,maxAmountIn:h(n),amountOut:h(r)},a);let i=[s({pubkey:rn.programId,isWritable:!1}),s({pubkey:t.id}),s({pubkey:t.authority,isWritable:!1}),s({pubkey:t.openOrders}),s({pubkey:t.targetOrders}),s({pubkey:t.baseVault}),s({pubkey:t.quoteVault})];return o===5&&i.push(s({pubkey:K})),i.push(s({pubkey:t.marketProgramId,isWritable:!1}),s({pubkey:t.marketId}),s({pubkey:t.marketBids}),s({pubkey:t.marketAsks}),s({pubkey:t.marketEventQueue}),s({pubkey:t.marketBaseVault}),s({pubkey:t.marketQuoteVault}),s({pubkey:t.marketAuthority,isWritable:!1}),s({pubkey:e.tokenAccountIn}),s({pubkey:e.tokenAccountOut}),s({pubkey:e.owner,isWritable:!1,isSigner:!0})),new N({programId:t.programId,keys:i,data:a})}function Ii(t){let a=t,{owner:e}=a,n=_e(a,["owner"]),r=Buffer.alloc(xe.span);xe.encode({instruction:10,nonce:n.nonce},r);let o=[...ce,s({pubkey:n.targetOrders}),s({pubkey:n.withdrawQueue}),s({pubkey:n.authority,isWritable:!1}),s({pubkey:n.lpMint}),s({pubkey:n.baseMint,isWritable:!1}),s({pubkey:n.quoteMint,isWritable:!1}),s({pubkey:n.baseVault}),s({pubkey:n.quoteVault}),s({pubkey:n.lpVault}),s({pubkey:n.marketId,isWritable:!1}),s({pubkey:e,isSigner:!0})];return new N({programId:n.programId,keys:o,data:r})}function Bi(t){let{poolKeys:e,userKeys:n,startTime:r}=t,o=Buffer.alloc(he.span);he.encode({instruction:0,nonce:e.nonce,startTime:h(r)},o);let a=[...ce,s({pubkey:e.id}),s({pubkey:e.authority,isWritable:!1}),s({pubkey:e.openOrders}),s({pubkey:e.lpMint}),s({pubkey:e.baseMint,isWritable:!1}),s({pubkey:e.quoteMint,isWritable:!1}),s({pubkey:e.baseVault,isWritable:!1}),s({pubkey:e.quoteVault,isWritable:!1}),s({pubkey:e.withdrawQueue}),s({pubkey:e.targetOrders}),s({pubkey:n.lpTokenAccount}),s({pubkey:e.lpVault,isWritable:!1}),s({pubkey:e.marketProgramId,isWritable:!1}),s({pubkey:e.marketId,isWritable:!1}),s({pubkey:n.payer,isSigner:!0})];return new N({programId:e.programId,keys:a,data:o})}function qi(t){let{poolKeys:e,userKeys:n,baseAmountIn:r,quoteAmountIn:o,fixedSide:a}=t,{version:i}=e;if(i===4||i===5){let u=Buffer.alloc(Le.span);Le.encode({instruction:3,baseAmountIn:h(r),quoteAmountIn:h(o),fixedSide:h(a==="base"?0:1)},u);let m=[s({pubkey:we,isWritable:!1}),s({pubkey:e.id}),s({pubkey:e.authority,isWritable:!1}),s({pubkey:e.openOrders,isWritable:!1}),s({pubkey:e.targetOrders}),s({pubkey:e.lpMint}),s({pubkey:e.baseVault}),s({pubkey:e.quoteVault})];return i===5&&m.push(s({pubkey:K})),m.push(s({pubkey:e.marketId,isWritable:!1}),s({pubkey:n.baseTokenAccount}),s({pubkey:n.quoteTokenAccount}),s({pubkey:n.lpTokenAccount}),s({pubkey:n.owner,isWritable:!1,isSigner:!0})),new N({programId:e.programId,keys:m,data:u})}return Z.logWithError("invalid version","poolKeys.version",i),new N({programId:e.programId,keys:[]})}function Ai(t){let{poolKeys:e,userKeys:n,amountIn:r}=t,{version:o}=e;if(o===4||o===5){let a=Buffer.alloc(Te.span);Te.encode({instruction:4,amountIn:h(r)},a);let i=[s({pubkey:we,isWritable:!1}),s({pubkey:e.id}),s({pubkey:e.authority,isWritable:!1}),s({pubkey:e.openOrders}),s({pubkey:e.targetOrders}),s({pubkey:e.lpMint}),s({pubkey:e.baseVault}),s({pubkey:e.quoteVault})];return o===5?i.push(s({pubkey:K})):i.push(s({pubkey:e.withdrawQueue}),s({pubkey:e.lpVault})),i.push(s({pubkey:e.marketProgramId,isWritable:!1}),s({pubkey:e.marketId}),s({pubkey:e.marketBaseVault}),s({pubkey:e.marketQuoteVault}),s({pubkey:e.marketAuthority,isWritable:!1}),s({pubkey:n.lpTokenAccount}),s({pubkey:n.baseTokenAccount}),s({pubkey:n.quoteTokenAccount}),s({pubkey:n.owner,isWritable:!1,isSigner:!0}),s({pubkey:e.marketEventQueue}),s({pubkey:e.marketBids}),s({pubkey:e.marketAsks})),new N({programId:e.programId,keys:i,data:a})}return Z.logWithError("invalid version","poolKeys.version",o),new N({programId:e.programId,keys:[]})}import{PublicKey as ut}from"@solana/web3.js";var Se=k("Raydium_liquidity_serum"),ct="9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",an=new ut(ct),Oi={[ct]:3},un={3:an};function mt(t){let e=Ke[t];return e||Se.logWithError("invalid version","version",t),e}function lt(t){let e=un[t];return e||Se.logWithError("invalid version","version",t),e}async function pt({programId:t,marketId:e}){let n=[e.toBuffer()],r=0,o;for(;r<100;){try{let a=n.concat(Buffer.from([r]),Buffer.alloc(7));o=await ut.createProgramAddress(a,t)}catch(a){if(a instanceof TypeError)throw a;r++;continue}return{publicKey:o,nonce:r}}throw Se.logWithError("unable to find a viable program address nonce","params",{programId:t,marketId:e}),new Error("unable to find a viable program address nonce")}var ee=k("Raydium_liquidity_util");function zi(t,e){let n=t instanceof D?t.token:R.WSOL,{baseMint:r,quoteMint:o}=e;if(n.mint.equals(r))return"base";if(n.mint.equals(o))return"quote";let a=`liquidity getTokenSide - token not match with pool, params: ${JSON.stringify({token:n.mint,baseMint:r,quoteMint:o})}`;throw console.error(a),new Error(a)}function Hi(t,e){let{baseMint:n,quoteMint:r}=e;return t.mint.equals(n)||t.mint.equals(r)}function Ji(t){let{status:e,startTime:n}=t,r=e.toNumber();return{[0]:{swap:!1,addLiquidity:!1,removeLiquidity:!1},[1]:{swap:!0,addLiquidity:!0,removeLiquidity:!0},[2]:{swap:!1,addLiquidity:!1,removeLiquidity:!1},[3]:{swap:!1,addLiquidity:!1,removeLiquidity:!0},[4]:{swap:!1,addLiquidity:!0,removeLiquidity:!0},[5]:{swap:!1,addLiquidity:!0,removeLiquidity:!0},[6]:{swap:!0,addLiquidity:!0,removeLiquidity:!0},[7]:{swap:Date.now()/1e3>=n.toNumber(),addLiquidity:!0,removeLiquidity:!0}}[r]||{swap:!1,addLiquidity:!1,removeLiquidity:!1}}function Xi(t){let e=st[t];return e||ee.logWithError("invalid version","version",t),e}function mn(t){let e=Me[t];return e||ee.logWithError("invalid version","version",t),e}async function E({name:t,programId:e,marketId:n}){let{publicKey:r}=await le([e.toBuffer(),n.toBuffer(),Buffer.from(t,"utf-8")],e);return r}async function ln({programId:t}){return le([Buffer.from([97,109,109,32,97,117,116,104,111,114,105,116,121])],t)}async function $i({version:t,marketId:e,baseMint:n,quoteMint:r}){let o=mn(t),[a,i,u]=[v({publicKey:e}),v({publicKey:n,transformSol:!0}),v({publicKey:r,transformSol:!0})],m=await E({name:"amm_associated_seed",programId:o,marketId:a}),p=await E({name:"lp_mint_associated_seed",programId:o,marketId:a}),{publicKey:l,nonce:d}=await ln({programId:o}),g=await E({name:"coin_vault_associated_seed",programId:o,marketId:a}),y=await E({name:"pc_vault_associated_seed",programId:o,marketId:a}),L=await E({name:"temp_lp_token_associated_seed",programId:o,marketId:a}),I=await E({name:"open_order_associated_seed",programId:o,marketId:a}),te=await E({name:"target_associated_seed",programId:o,marketId:a}),ne=await E({name:"withdraw_associated_seed",programId:o,marketId:a}),Ie=mt(t),Be=lt(Ie),{publicKey:yt}=await pt({programId:Be,marketId:a});return{id:m,baseMint:i,quoteMint:u,lpMint:p,version:t,programId:o,authority:l,nonce:d,baseVault:g,quoteVault:y,lpVault:L,openOrders:I,targetOrders:te,withdrawQueue:ne,marketVersion:Ie,marketProgramId:Be,marketId:a,marketAuthority:yt}}async function Zi({connection:t,pools:e}){let n=e.map(o=>at(o));return(await $e(t,n,"GetPoolData")).map(o=>{let a=Ze(o,"GetPoolData"),i=new Q(A(a,"status")),u=Number(A(a,"coin_decimals")),m=Number(A(a,"pc_decimals")),p=Number(A(a,"lp_decimals")),l=new Q(A(a,"pool_coin_amount")),d=new Q(A(a,"pool_pc_amount")),g=new Q(A(a,"pool_lp_supply")),y="0";try{y=A(a,"pool_open_time")}catch{y="0"}return{status:i,baseDecimals:u,quoteDecimals:m,lpDecimals:p,baseReserve:l,quoteReserve:d,lpSupply:g,startTime:new Q(y)}})}function es(t,e,n){return pn(t.token,e.token,n)}function pn(t,e,n){let{baseMint:r,quoteMint:o}=n,a=dt(t,n),i=dt(e,n);return a===i&&ee.logWithError("tokens not match with pool","params",{tokenA:t.mint,tokenB:e.mint,baseMint:r,quoteMint:o}),[a,i]}function dt(t,e){let{baseMint:n,quoteMint:r}=e;return t.mint.equals(n)?"base":t.mint.equals(r)?"quote":(ee.logWithError("token not match with pool","params",{token:t.mint,baseMint:n,quoteMint:r}),"base")}var ts=t=>t==="a"||t==="b";async function ns(t,e,n){let r=await t.getAccountInfo(e);if(r===null)return null;let o=ke.decode(r.data),a=await t.getTokenAccountBalance(o.baseVault),i=await t.getTokenAccountBalance(o.quoteVault),u=await cn.load(t,o.openOrders,n),m=10**o.baseDecimal.toNumber(),p=10**o.quoteDecimal.toNumber(),l=u.baseTokenTotal.toNumber()/m,d=u.quoteTokenTotal.toNumber()/p,g=o.baseNeedTakePnl.toNumber()/m,y=o.quoteNeedTakePnl.toNumber()/p,L=a.value.uiAmount+l-g,I=i.value.uiAmount+d-y,te=parseFloat(o.lpReserve.toString()),ne=L/I;return{baseAmount:L,quoteAmount:I,lpSupply:te,baseVaultKey:o.baseVault,quoteVaultKey:o.quoteVault,baseVaultBalance:a.value.uiAmount,quoteVaultBalance:i.value.uiAmount,openOrdersKey:o.openOrders,openOrdersTotalBase:l,openOrdersTotalQuote:d,basePnl:g,quotePnl:y,priceInQuote:ne}}export{Bt as DataElement,gn as LIQUIDITY_FEES_DENOMINATOR,fn as LIQUIDITY_FEES_NUMERATOR,Pn as LIQUIDITY_PROGRAMID_TO_VERSION,Pt as LIQUIDITY_PROGRAM_ID_V4,xt as LIQUIDITY_PROGRAM_ID_V5,Me as LIQUIDITY_VERSION_TO_PROGRAM_ID,Ke as LIQUIDITY_VERSION_TO_SERUM_VERSION,st as LIQUIDITY_VERSION_TO_STATE_LAYOUT,Oe as LiquidityPoolStatus,K as MODEL_DATA_PUBKEY,Oi as SERUM_PROGRAMID_TO_VERSION,an as SERUM_PROGRAM_ID_V3,un as SERUM_VERSION_TO_PROGRAM_ID,Ye as StableLayout,We as _LIQUIDITY_PROGRAM_ID_V4,Re as _LIQUIDITY_PROGRAM_ID_V5,ct as _SERUM_PROGRAM_ID_V3,Le as addLiquidityLayout,xe as createPoolV4Layout,ge as fixedSwapInLayout,Pe as fixedSwapOutLayout,Mt as formatLayout,zi as getAmountSide,es as getAmountsSide,$i as getAssociatedPoolKeys,Sr as getDxByDyBaseIn,wr as getDyByDxBaseIn,ln as getLiquidityAssociatedAuthority,E as getLiquidityAssociatedId,ns as getLiquidityInfo,mn as getLiquidityProgramId,Xi as getLiquidityStateLayout,Ji as getPoolEnabledFeatures,pt as getSerumAssociatedAuthority,lt as getSerumProgramId,mt as getSerumVersion,Ir as getStablePrice,dt as getTokenSide,pn as getTokensSide,Hi as includesToken,he as initPoolLayout,ts as isValidFixedSide,ke as liquidityStateV4Layout,nn as liquidityStateV5Layout,Si as makeAMMSwapInstruction,qi as makeAddLiquidityInstruction,Ii as makeCreatePoolInstruction,Bi as makeInitPoolInstruction,Ai as makeRemoveLiquidityInstruction,at as makeSimulatePoolInfoInstruction,Zi as makeSimulationPoolInfo,on as makeSwapFixedInInstruction,sn as makeSwapFixedOutInstruction,qt as modelDataInfoLayout,Te as removeLiquidityLayout};
//# sourceMappingURL=index.mjs.map