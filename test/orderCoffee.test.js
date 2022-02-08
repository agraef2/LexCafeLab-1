const assert = require("chai").assert;

const orderCoffee = require("../orderCoffee");

var AWS = require("aws-sdk");

describe("DialogCodeHook with no slots", () => {
  it("Inital message - I will like to have a drink", (done) => {
    const intentRequest = {
      sessionId: "77406221768695",
      inputTranscript: "I would like a coffee",
      interpretations: [
        {
          intent: {
            slots: {
              size: null,
              coffee: null,
            },
            confirmationState: "None",
            name: "CoffeeOrder",
            state: "InProgress",
          },
          nluConfidence: 0.9,
        },
        {
          intent: {
            slots: {
              user_feelings: null,
            },
            confirmationState: "None",
            name: "Greetings",
            state: "InProgress",
          },
          nluConfidence: 0.56,
        },
        {
          intent: {
            slots: {},
            confirmationState: "None",
            name: "FallbackIntent",
            state: "InProgress",
          },
        },
      ],
      proposedNextState: {
        intent: {
          slots: {
            size: null,
            coffee: null,
          },
          confirmationState: "None",
          name: "CoffeeOrder",
          state: "InProgress",
        },
        dialogAction: {
          slotToElicit: "coffee",
          type: "ElicitSlot",
        },
      },
      responseContentType: "text/plain; charset=utf-8",
      sessionState: {
        intent: {
          slots: {
            size: null,
            coffee: null,
          },
          confirmationState: "None",
          name: "CoffeeOrder",
          state: "InProgress",
        },
        originatingRequestId: "33e9333f-e568-46ee-8db3-271e475a5ba7",
      },
      messageVersion: "1.0",
      invocationSource: "DialogCodeHook",
      transcriptions: [
        {
          resolvedSlots: {},
          resolvedContext: {
            intent: "CoffeeOrder",
          },
          transcription: "I would like a coffee",
          transcriptionConfidence: 1,
        },
      ],
      inputMode: "Text",
      bot: {
        aliasName: "TestBotAlias",
        aliasId: "TSTALIASID",
        name: "CafeDemo2",
        version: "DRAFT",
        localeId: "en_US",
        id: "SMZ1R0JPYP",
      },
    };

    const expectedResponse = {
      sessionState: {
        dialogAction: { type: "Delegate" },
        intent: {
          slots: { size: null, coffee: null },
          confirmationState: "None",
          name: "CoffeeOrder",
          state: "InProgress",
        },
      },
    };

    orderCoffee(intentRequest).then((response) => {
      assert.equal(JSON.stringify(expectedResponse), JSON.stringify(response));
      done();
    });
  });
});

describe("DialogCodeHook with drink slot", () => {
  it("Inital message - I would like to order late", (done) => {
    const intentRequest = {
      sessionId: "774062217686839",
      inputTranscript: "late",
      interpretations: [
        {
          intent: {
            slots: {
              size: null,
              coffee: {
                shape: "Scalar",
                value: {
                  originalValue: "late",
                  resolvedValues: ["late"],
                  interpretedValue: "late",
                },
              },
            },
            confirmationState: "None",
            name: "CoffeeOrder",
            state: "InProgress",
          },
          nluConfidence: 1,
        },
        {
          intent: {
            slots: {},
            confirmationState: "None",
            name: "FallbackIntent",
            state: "InProgress",
          },
        },
        {
          intent: {
            slots: {
              user_feelings: null,
            },
            confirmationState: "None",
            name: "Greetings",
            state: "InProgress",
          },
          nluConfidence: 0.41,
        },
      ],
      proposedNextState: {
        intent: {
          slots: {
            size: null,
            coffee: {
              shape: "Scalar",
              value: {
                originalValue: "late",
                resolvedValues: ["late"],
                interpretedValue: "late",
              },
            },
          },
          confirmationState: "None",
          name: "CoffeeOrder",
          state: "InProgress",
        },
        dialogAction: {
          slotToElicit: "size",
          type: "ElicitSlot",
        },
      },
      responseContentType: "text/plain; charset=utf-8",
      sessionState: {
        activeContexts: [],
        intent: {
          slots: {
            size: null,
            coffee: {
              shape: "Scalar",
              value: {
                originalValue: "late",
                resolvedValues: ["late"],
                interpretedValue: "late",
              },
            },
          },
          confirmationState: "None",
          name: "CoffeeOrder",
          state: "InProgress",
        },
        originatingRequestId: "c890f678-753f-451d-ace7-b290e1485d33",
      },
      messageVersion: "1.0",
      invocationSource: "DialogCodeHook",
      transcriptions: [
        {
          resolvedSlots: {
            coffee: {
              shape: "Scalar",
              value: {
                originalValue: "late",
                resolvedValues: ["late"],
              },
            },
          },
          resolvedContext: {
            intent: "CoffeeOrder",
          },
          transcription: "late",
          transcriptionConfidence: 1,
        },
      ],
      inputMode: "Text",
      bot: {
        aliasName: "TestBotAlias",
        aliasId: "TSTALIASID",
        name: "CafeDemo2",
        version: "DRAFT",
        localeId: "en_US",
        id: "SMZ1R0JPYP",
      },
    };

    const expectedResponse = {
      sessionState: {
        dialogAction: { type: "Delegate" },
        intent: {
          slots: {
            size: null,
            coffee: {
              shape: "Scalar",
              value: {
                originalValue: "late",
                resolvedValues: ["late"],
                interpretedValue: "late",
              },
            },
          },
          confirmationState: "None",
          name: "CoffeeOrder",
          state: "InProgress",
        },
      },
    };

    orderCoffee(intentRequest).then((response) => {
      assert.equal(JSON.stringify(expectedResponse), JSON.stringify(response));
      done();
    });
  });
});

describe("DialogCodeHook with 2 valid slot", () => {
  it("latte + normal", (done) => {
    const intentRequest = {
      sessionId: "774062217686839",
      inputTranscript: "yes",
      interpretations: [
        {
          intent: {
            slots: {
              size: {
                shape: "Scalar",
                value: {
                  originalValue: "normal",
                  resolvedValues: ["normal"],
                  interpretedValue: "normal",
                },
              },
              coffee: {
                shape: "Scalar",
                value: {
                  originalValue: "late",
                  resolvedValues: ["late"],
                  interpretedValue: "late",
                },
              },
            },
            confirmationState: "Confirmed",
            name: "CoffeeOrder",
            state: "InProgress",
          },
          nluConfidence: 1,
        },
        {
          intent: {
            slots: {},
            confirmationState: "None",
            name: "FallbackIntent",
            state: "InProgress",
          },
        },
        {
          intent: {
            slots: {
              user_feelings: null,
            },
            confirmationState: "None",
            name: "Greetings",
            state: "InProgress",
          },
          nluConfidence: 0.3,
        },
      ],
      responseContentType: "text/plain; charset=utf-8",
      sessionState: {
        activeContexts: [],
        intent: {
          slots: {
            size: {
              shape: "Scalar",
              value: {
                originalValue: "normal",
                resolvedValues: ["normal"],
                interpretedValue: "normal",
              },
            },
            coffee: {
              shape: "Scalar",
              value: {
                originalValue: "late",
                resolvedValues: ["late"],
                interpretedValue: "late",
              },
            },
          },
          confirmationState: "Confirmed",
          name: "CoffeeOrder",
          state: "InProgress",
        },
        originatingRequestId: "c890f678-753f-451d-ace7-b290e1485d33",
      },
      messageVersion: "1.0",
      invocationSource: "DialogCodeHook",
      transcriptions: [
        {
          resolvedSlots: {},
          resolvedContext: {
            intent: "CoffeeOrder",
          },
          transcription: "yes",
          transcriptionConfidence: 1,
        },
      ],
      inputMode: "Text",
      bot: {
        aliasName: "TestBotAlias",
        aliasId: "TSTALIASID",
        name: "CafeDemo2",
        version: "DRAFT",
        localeId: "en_US",
        id: "SMZ1R0JPYP",
      },
    };

    const expectedResponse = {
      sessionState: {
        dialogAction: { type: "Delegate" },
        intent: {
          slots: {
            size: {
              shape: "Scalar",
              value: {
                originalValue: "normal",
                resolvedValues: ["normal"],
                interpretedValue: "normal",
              },
            },
            coffee: {
              shape: "Scalar",
              value: {
                originalValue: "late",
                resolvedValues: ["late"],
                interpretedValue: "late",
              },
            },
          },
          confirmationState: "None",
          name: "CoffeeOrder",
          state: "InProgress",
        },
      },
    };

    orderCoffee(intentRequest).then((response) => {
      assert.equal(JSON.stringify(expectedResponse), JSON.stringify(response));
      done();
    });
  });
});

describe("FulfillmentCodeHook with 2 valid slot", () => {
  xit("late + normal", (done) => {
    AWS.config.update({ region: "us-west-2" });
    const intentRequest = {
      messageVersion: "1.0",
      invocationSource: "FulfillmentCodeHook",
      userId: "javddgb05spb4iu06nsu29jax6lphg9n",
      sessionAttributes: null,
      bot: { name: "CafeDemo", alias: null, version: "$LATEST" },
      outputDialogMode: "Text",
      currentIntent: {
        name: "CoffeeOrder",
        slots: { size: "normal", coffee: "late" },
        confirmationStatus: "Confirmed",
      },
      inputTranscript: "yes",
    };

    orderCoffee(intentRequest).then((response) => {
      assert.equal(response.dialogAction.type, "Close");
      assert.equal(response.dialogAction.fulfillmentState, "Fulfilled");
      done();
    });
  });
});
