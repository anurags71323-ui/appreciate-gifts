import { a as useQuery } from "./useMutation-C60F637E.js";
import { P as ProtocolError, T as TimeoutWaitingForResponseErrorCode, p as utf8ToBytes, E as ExternalError, M as MissingRootKeyErrorCode, C as Certificate, q as lookupResultToBuffer, s as RequestStatusResponseStatus, t as UnknownError, v as RequestStatusDoneNoReplyErrorCode, w as RejectError, x as CertifiedRejectErrorCode, y as UNREACHABLE_ERROR, I as InputError, z as InvalidReadStateRequestErrorCode, A as ReadRequestType, D as Principal, F as IDL, G as MissingCanisterIdErrorCode, J as HttpAgent, K as encode, Q as QueryResponseStatus, N as UncertifiedRejectErrorCode, O as isV3ResponseBody, V as isV2ResponseBody, W as UncertifiedRejectUpdateErrorCode, Y as UnexpectedErrorCode, Z as decode, _ as useInternetIdentity, m as useQueryClient, r as reactExports, $ as createActorWithConfig, c as createLucideIcon, j as jsxRuntimeExports, a0 as createSlot, a1 as Record, a2 as Vec, a3 as Variant, a4 as Opt, a5 as Service, a6 as Func, a7 as Text, a8 as Bool, a9 as Nat, aa as Null, ab as Int, ac as Principal$1, ad as Nat8 } from "./index-76_1P84y.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a = agent.createReadStateRequest) == null ? void 0 : _a.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a, _b;
      options = {
        ...options,
        ...(_b = (_a = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b.call(_a, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a, _b;
      options = {
        ...options,
        ...(_b = (_a = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b.call(_a, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
function hasAccessControl(actor) {
  return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      const isAuthenticated = !!identity;
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(createActor2, actorOptions);
      if (hasAccessControl(actor)) {
        await actor._initializeAccessControl();
      }
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
      key: "1a0edw"
    }
  ],
  ["path", { d: "M12 22V12", key: "d0xqtd" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }]
];
const Package = createLucideIcon("package", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
const ShippingAddressInput = Record({
  "country": Text,
  "city": Text,
  "postalCode": Text,
  "fullName": Text,
  "state": Text,
  "streetAddress": Text
});
const AddressId = Text;
const ShippingAddress = Record({
  "id": AddressId,
  "country": Text,
  "city": Text,
  "postalCode": Text,
  "fullName": Text,
  "state": Text,
  "isDefault": Bool,
  "streetAddress": Text
});
const ProductId = Text;
const LineItem = Record({
  "productId": ProductId,
  "quantity": Nat
});
const Product = Record({
  "id": ProductId,
  "featured": Bool,
  "name": Text,
  "tags": Vec(Text),
  "description": Text,
  "imageUrl": Text,
  "price": Nat
});
const StripeSessionStatus = Variant({
  "completed": Record({
    "userPrincipal": Opt(Text),
    "response": Text
  }),
  "failed": Record({ "error": Text })
});
const OrderId = Text;
const OrderStatus = Variant({
  "cancelled": Null,
  "pending": Null,
  "completed": Null
});
const Timestamp = Int;
const Order = Record({
  "id": OrderId,
  "status": OrderStatus,
  "total": Nat,
  "userId": Opt(Principal$1),
  "timestamp": Timestamp,
  "items": Vec(LineItem)
});
const StripeConfiguration = Record({
  "allowedCountries": Vec(Text),
  "secretKey": Text
});
const http_header = Record({
  "value": Text,
  "name": Text
});
const http_request_result = Record({
  "status": Nat,
  "body": Vec(Nat8),
  "headers": Vec(http_header)
});
const TransformationInput = Record({
  "context": Vec(Nat8),
  "response": http_request_result
});
const TransformationOutput = Record({
  "status": Nat,
  "body": Vec(Nat8),
  "headers": Vec(http_header)
});
Service({
  "addShippingAddress": Func(
    [ShippingAddressInput],
    [Variant({ "ok": ShippingAddress, "err": Text })],
    []
  ),
  "addToWishlist": Func(
    [Text],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "createCheckoutSession": Func(
    [Vec(LineItem), Text, Text],
    [Text],
    []
  ),
  "deleteShippingAddress": Func(
    [Text],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "getProduct": Func([ProductId], [Opt(Product)], ["query"]),
  "getProducts": Func([], [Vec(Product)], ["query"]),
  "getStripeSessionStatus": Func([Text], [StripeSessionStatus], []),
  "getUserOrders": Func([], [Vec(Order)], ["query"]),
  "getUserShippingAddresses": Func([], [Vec(ShippingAddress)], []),
  "getUserWishlist": Func([], [Vec(Product)], []),
  "isProductInWishlist": Func([Text], [Bool], []),
  "isStripeConfigured": Func([], [Bool], ["query"]),
  "removeFromWishlist": Func(
    [Text],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "setDefaultShippingAddress": Func(
    [Text],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "setStripeConfiguration": Func([StripeConfiguration], [], []),
  "transform": Func(
    [TransformationInput],
    [TransformationOutput],
    ["query"]
  ),
  "updateShippingAddress": Func(
    [Text, ShippingAddressInput],
    [Variant({ "ok": ShippingAddress, "err": Text })],
    []
  )
});
const idlFactory = ({ IDL: IDL2 }) => {
  const ShippingAddressInput2 = IDL2.Record({
    "country": IDL2.Text,
    "city": IDL2.Text,
    "postalCode": IDL2.Text,
    "fullName": IDL2.Text,
    "state": IDL2.Text,
    "streetAddress": IDL2.Text
  });
  const AddressId2 = IDL2.Text;
  const ShippingAddress2 = IDL2.Record({
    "id": AddressId2,
    "country": IDL2.Text,
    "city": IDL2.Text,
    "postalCode": IDL2.Text,
    "fullName": IDL2.Text,
    "state": IDL2.Text,
    "isDefault": IDL2.Bool,
    "streetAddress": IDL2.Text
  });
  const ProductId2 = IDL2.Text;
  const LineItem2 = IDL2.Record({
    "productId": ProductId2,
    "quantity": IDL2.Nat
  });
  const Product2 = IDL2.Record({
    "id": ProductId2,
    "featured": IDL2.Bool,
    "name": IDL2.Text,
    "tags": IDL2.Vec(IDL2.Text),
    "description": IDL2.Text,
    "imageUrl": IDL2.Text,
    "price": IDL2.Nat
  });
  const StripeSessionStatus2 = IDL2.Variant({
    "completed": IDL2.Record({
      "userPrincipal": IDL2.Opt(IDL2.Text),
      "response": IDL2.Text
    }),
    "failed": IDL2.Record({ "error": IDL2.Text })
  });
  const OrderId2 = IDL2.Text;
  const OrderStatus2 = IDL2.Variant({
    "cancelled": IDL2.Null,
    "pending": IDL2.Null,
    "completed": IDL2.Null
  });
  const Timestamp2 = IDL2.Int;
  const Order2 = IDL2.Record({
    "id": OrderId2,
    "status": OrderStatus2,
    "total": IDL2.Nat,
    "userId": IDL2.Opt(IDL2.Principal),
    "timestamp": Timestamp2,
    "items": IDL2.Vec(LineItem2)
  });
  const StripeConfiguration2 = IDL2.Record({
    "allowedCountries": IDL2.Vec(IDL2.Text),
    "secretKey": IDL2.Text
  });
  const http_header2 = IDL2.Record({ "value": IDL2.Text, "name": IDL2.Text });
  const http_request_result2 = IDL2.Record({
    "status": IDL2.Nat,
    "body": IDL2.Vec(IDL2.Nat8),
    "headers": IDL2.Vec(http_header2)
  });
  const TransformationInput2 = IDL2.Record({
    "context": IDL2.Vec(IDL2.Nat8),
    "response": http_request_result2
  });
  const TransformationOutput2 = IDL2.Record({
    "status": IDL2.Nat,
    "body": IDL2.Vec(IDL2.Nat8),
    "headers": IDL2.Vec(http_header2)
  });
  return IDL2.Service({
    "addShippingAddress": IDL2.Func(
      [ShippingAddressInput2],
      [IDL2.Variant({ "ok": ShippingAddress2, "err": IDL2.Text })],
      []
    ),
    "addToWishlist": IDL2.Func(
      [IDL2.Text],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "createCheckoutSession": IDL2.Func(
      [IDL2.Vec(LineItem2), IDL2.Text, IDL2.Text],
      [IDL2.Text],
      []
    ),
    "deleteShippingAddress": IDL2.Func(
      [IDL2.Text],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "getProduct": IDL2.Func([ProductId2], [IDL2.Opt(Product2)], ["query"]),
    "getProducts": IDL2.Func([], [IDL2.Vec(Product2)], ["query"]),
    "getStripeSessionStatus": IDL2.Func([IDL2.Text], [StripeSessionStatus2], []),
    "getUserOrders": IDL2.Func([], [IDL2.Vec(Order2)], ["query"]),
    "getUserShippingAddresses": IDL2.Func([], [IDL2.Vec(ShippingAddress2)], []),
    "getUserWishlist": IDL2.Func([], [IDL2.Vec(Product2)], []),
    "isProductInWishlist": IDL2.Func([IDL2.Text], [IDL2.Bool], []),
    "isStripeConfigured": IDL2.Func([], [IDL2.Bool], ["query"]),
    "removeFromWishlist": IDL2.Func(
      [IDL2.Text],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "setDefaultShippingAddress": IDL2.Func(
      [IDL2.Text],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "setStripeConfiguration": IDL2.Func([StripeConfiguration2], [], []),
    "transform": IDL2.Func(
      [TransformationInput2],
      [TransformationOutput2],
      ["query"]
    ),
    "updateShippingAddress": IDL2.Func(
      [IDL2.Text, ShippingAddressInput2],
      [IDL2.Variant({ "ok": ShippingAddress2, "err": IDL2.Text })],
      []
    )
  });
};
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async addShippingAddress(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.addShippingAddress(arg0);
        return from_candid_variant_n1(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addShippingAddress(arg0);
      return from_candid_variant_n1(this._uploadFile, this._downloadFile, result);
    }
  }
  async addToWishlist(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.addToWishlist(arg0);
        return from_candid_variant_n2(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addToWishlist(arg0);
      return from_candid_variant_n2(this._uploadFile, this._downloadFile, result);
    }
  }
  async createCheckoutSession(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.createCheckoutSession(arg0, arg1, arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createCheckoutSession(arg0, arg1, arg2);
      return result;
    }
  }
  async deleteShippingAddress(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteShippingAddress(arg0);
        return from_candid_variant_n2(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteShippingAddress(arg0);
      return from_candid_variant_n2(this._uploadFile, this._downloadFile, result);
    }
  }
  async getProduct(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getProduct(arg0);
        return from_candid_opt_n3(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getProduct(arg0);
      return from_candid_opt_n3(this._uploadFile, this._downloadFile, result);
    }
  }
  async getProducts() {
    if (this.processError) {
      try {
        const result = await this.actor.getProducts();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getProducts();
      return result;
    }
  }
  async getStripeSessionStatus(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getStripeSessionStatus(arg0);
        return from_candid_StripeSessionStatus_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getStripeSessionStatus(arg0);
      return from_candid_StripeSessionStatus_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async getUserOrders() {
    if (this.processError) {
      try {
        const result = await this.actor.getUserOrders();
        return from_candid_vec_n8(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getUserOrders();
      return from_candid_vec_n8(this._uploadFile, this._downloadFile, result);
    }
  }
  async getUserShippingAddresses() {
    if (this.processError) {
      try {
        const result = await this.actor.getUserShippingAddresses();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getUserShippingAddresses();
      return result;
    }
  }
  async getUserWishlist() {
    if (this.processError) {
      try {
        const result = await this.actor.getUserWishlist();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getUserWishlist();
      return result;
    }
  }
  async isProductInWishlist(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.isProductInWishlist(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.isProductInWishlist(arg0);
      return result;
    }
  }
  async isStripeConfigured() {
    if (this.processError) {
      try {
        const result = await this.actor.isStripeConfigured();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.isStripeConfigured();
      return result;
    }
  }
  async removeFromWishlist(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.removeFromWishlist(arg0);
        return from_candid_variant_n2(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.removeFromWishlist(arg0);
      return from_candid_variant_n2(this._uploadFile, this._downloadFile, result);
    }
  }
  async setDefaultShippingAddress(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.setDefaultShippingAddress(arg0);
        return from_candid_variant_n2(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setDefaultShippingAddress(arg0);
      return from_candid_variant_n2(this._uploadFile, this._downloadFile, result);
    }
  }
  async setStripeConfiguration(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.setStripeConfiguration(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setStripeConfiguration(arg0);
      return result;
    }
  }
  async transform(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.transform(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.transform(arg0);
      return result;
    }
  }
  async updateShippingAddress(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateShippingAddress(arg0, arg1);
        return from_candid_variant_n1(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateShippingAddress(arg0, arg1);
      return from_candid_variant_n1(this._uploadFile, this._downloadFile, result);
    }
  }
}
function from_candid_OrderStatus_n11(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n12(_uploadFile, _downloadFile, value);
}
function from_candid_Order_n9(_uploadFile, _downloadFile, value) {
  return from_candid_record_n10(_uploadFile, _downloadFile, value);
}
function from_candid_StripeSessionStatus_n4(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n5(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n13(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n3(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n7(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_record_n10(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_OrderStatus_n11(_uploadFile, _downloadFile, value.status),
    total: value.total,
    userId: record_opt_to_undefined(from_candid_opt_n13(_uploadFile, _downloadFile, value.userId)),
    timestamp: value.timestamp,
    items: value.items
  };
}
function from_candid_record_n6(_uploadFile, _downloadFile, value) {
  return {
    userPrincipal: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.userPrincipal)),
    response: value.response
  };
}
function from_candid_variant_n1(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n12(_uploadFile, _downloadFile, value) {
  return "cancelled" in value ? "cancelled" : "pending" in value ? "pending" : "completed" in value ? "completed" : value;
}
function from_candid_variant_n2(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n5(_uploadFile, _downloadFile, value) {
  return "completed" in value ? {
    __kind__: "completed",
    completed: from_candid_record_n6(_uploadFile, _downloadFile, value.completed)
  } : "failed" in value ? {
    __kind__: "failed",
    failed: value.failed
  } : value;
}
function from_candid_vec_n8(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Order_n9(_uploadFile, _downloadFile, x));
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
export {
  Primitive as P,
  Trash2 as T,
  Plus as a,
  Package as b,
  createActor as c,
  useActor as u
};
