import * as vi from 'vitest'
import { z } from 'zod'
import { zx } from '@traversable/zod'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.deepPartial❳: throws given a circular schema', () => {
    const Circular = z.object({ get a() { return Circular } })
    vi.assert.throws(() => zx.deepPartial(Circular), 'Circular schema detected')
  })

  vi.test('〖⛳️〗› ❲zx.deepPartial❳: preserves structure of original schema', () => {
    vi.expect.soft(format(
      zx.deepPartial.writeable(
        z.object({
          a: z.number(),
          b: z.string(),
          c: z.object({
            d: z.array(z.object({
              e: z.number().max(1),
              f: z.boolean()
            })).length(10)
          })
        })
      )
    )).toMatchInlineSnapshot
      (`
      "z.object({
        a: z.number().optional(),
        b: z.string().optional(),
        c: z
          .object({
            d: z
              .array(
                z.object({
                  e: z.number().max(1).optional(),
                  f: z.boolean().optional(),
                }),
              )
              .length(10)
              .optional(),
          })
          .optional(),
      })
      "
    `)

    // #382 https://github.com/traversable/schema/issues/382
    const AccessLevel = z.strictObject({
      _id: z.string().regex(/^[a-f\d]{24}$/),
      description: z.string().min(1).optional(),
      name: z.string().min(1),
      tags: z.array(z.string().min(1)).optional()
    })

    const deepPartial_01 = zx.deepPartial(AccessLevel)

    vi.assert.doesNotThrow(() =>
      deepPartial_01.parse({
        '_id': '5c7589dd5800719820e7b874',
        'description': 'ContactMethodTypesLoad_Description',
        'name': 'api/contactmethodtypes/load',
        'tags': ['API', 'ContactMethodType', 'Load']
      })
    )

    // #385 https://github.com/traversable/schema/issues/385
    const Organization = z.object({
      name: z.string(),
      type: z.literal('organization')
    })

    const Individual = z.object({
      name: z.object({
        firstName: z.string(),
        lastName: z.string()
      }),
      type: z.literal('individual')
    })

    const Entity = z.union([Individual, Organization])

    const deepPartial_02 = zx.deepPartial(Entity, 'applyToOutputType')

    vi.assert.doesNotThrow(() =>
      deepPartial_02.parse({
        type: 'individual',
        name: {
          firstName: 'Tyrone',
          lastName: 'Slothrop',
        }
      })
    )

    // #388 https://github.com/traversable/schema/issues/388
    vi.assert.doesNotThrow(() =>
      deepPartial_02.parse({})
    )

    vi.assert.doesNotThrow(
      () => zx.deepPartial(
        z.object({
          a: z.number(),
          b: z.string(),
          c: z.object({
            d: z.array(z.object({
              e: z.number().max(1),
              f: z.boolean()
            })).length(1)
          })
        })
      ).parse(
        {}
      )
    )


    vi.assert.doesNotThrow(
      () => zx.deepPartial(
        z.object({
          a: z.number(),
          b: z.string(),
          c: z.object({
            d: z.array(z.object({
              e: z.number().max(1),
              f: z.boolean()
            })).length(1)
          })
        })
      ).parse(
        {
          c: {}
        }
      )
    )

    vi.assert.doesNotThrow(
      () => zx.deepPartial(
        z.object({
          a: z.number(),
          b: z.string(),
          c: z.object({
            d: z.array(z.object({
              e: z.number().max(1),
              f: z.boolean()
            })).length(1)
          })
        })
      ).parse(
        {
          c: {
            d: [
              {}
            ]
          }
        }
      )
    )

    vi.assert.throws(
      () => zx.deepPartial(
        z.object({
          a: z.number(),
          b: z.string(),
          c: z.object({
            d: z.array(z.object({
              e: z.number().max(1),
              f: z.boolean()
            })).length(1)
          })
        })
      ).parse(
        {
          c: {
            d: []
          }
        }
      )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.string()
        ).parse('')
    )

    vi.assert.throws(
      () =>
        zx.deepPartial(
          z.string()
        ).parse(undefined)
    )

    vi.assert.throws(
      () =>
        zx.deepPartial(
          z.string()
        ).parse(undefined)
    )

    vi.assert.throws(
      () =>
        zx.deepPartial(
          z.union([
            z.string()
          ])
        ).parse(undefined)
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.union([
            z.object({
              a: z.string()
            })
          ])
        ).parse({})
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.union([
            z.object({
              a: z.string()
            })
          ])
        ).parse({ a: undefined })
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.union([
            z.object({
              a: z.string()
            })
          ])
        ).parse({ a: '' })
    )

    vi.assert.throws(
      () =>
        zx.deepPartial(
          z.union([
            z.object({
              a: z.string()
            })
          ])
        ).parse({ a: 1 })
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.intersection(
            z.object({
              a: z.string()
            }),
            z.object({
              b: z.string()
            })
          )
        ).parse({})
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.intersection(
            z.object({
              a: z.string()
            }),
            z.object({
              b: z.string()
            })
          )
        ).parse({
          a: ''
        })
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.intersection(
            z.object({
              a: z.string()
            }),
            z.object({
              b: z.string()
            })
          )
        ).parse({
          b: ''
        })
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.intersection(
            z.object({
              a: z.string()
            }),
            z.object({
              b: z.string()
            })
          )
        ).parse({
          a: '',
          b: '',
        })
    )

    vi.assert.throws(
      () =>
        zx.deepPartial(
          z.intersection(
            z.object({
              a: z.string()
            }),
            z.object({
              b: z.string()
            })
          )
        ).parse({
          a: 1,
        })
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.union([
            z.strictObject({
              a: z.string()
            }),
            z.strictObject({
              b: z.string()
            })
          ])
        ).parse({})
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.union([
            z.strictObject({
              a: z.string()
            }),
            z.strictObject({
              b: z.string()
            })
          ])
        ).parse({
          a: ''
        })
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.union([
            z.strictObject({
              a: z.string()
            }),
            z.strictObject({
              b: z.string()
            })
          ])
        ).parse({
          b: ''
        })
    )

    vi.assert.throws(
      () =>
        zx.deepPartial(
          z.union([
            z.strictObject({
              a: z.string()
            }),
            z.strictObject({
              b: z.string()
            })
          ])
        ).parse({
          a: '',
          b: ''
        })
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.map(
            z.object({
              a: z.string()
            }),
            z.object({
              b: z.string()
            })
          )
        ).parse(
          new Map([
            [
              {},
              {}
            ]
          ])
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.map(
            z.object({
              a: z.string()
            }),
            z.object({
              b: z.string()
            })
          )
        ).parse(
          new Map([
            [
              { a: '' },
              {}
            ]
          ])
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.map(
            z.object({
              a: z.string()
            }),
            z.object({
              b: z.string()
            })
          )
        ).parse(
          new Map([
            [
              {},
              { b: '' }
            ]
          ])
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.map(
            z.object({
              a: z.string()
            }),
            z.object({
              b: z.string()
            })
          )
        ).parse(
          new Map([
            [
              { a: '' },
              { b: '' }
            ]
          ])
        )
    )

    vi.assert.throws(
      () =>
        zx.deepPartial(
          z.map(
            z.object({
              a: z.string()
            }),
            z.object({
              b: z.string()
            })
          )
        ).parse(
          new Map([
            [
              { a: 1 },
              {}
            ]
          ])
        )
    )

    vi.assert.throws(
      () =>
        zx.deepPartial(
          z.map(
            z.object({
              a: z.string()
            }),
            z.object({
              b: z.string()
            })
          )
        ).parse(
          new Map([
            [
              {},
              { b: 1 }
            ]
          ])
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.set(
            z.object({
              a: z.string()
            }),
          )
        ).parse(
          new Set([
            {}
          ])
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.set(
            z.object({
              a: z.string()
            }),
          )
        ).parse(
          new Set([
            { a: '' }
          ])
        )
    )

    vi.assert.throws(
      () =>
        zx.deepPartial(
          z.set(
            z.object({
              a: z.string()
            }),
          )
        ).parse(
          new Set([
            { a: 1 }
          ])
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.array(
            z.object({
              a: z.string()
            }),
          )
        ).parse(
          [
            {}
          ]
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.array(
            z.object({
              a: z.string()
            }),
          )
        ).parse(
          [
            { a: '' }
          ]
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.array(
            z.object({
              a: z.string()
            }),
          )
        ).parse(
          [
            { a: undefined }
          ]
        )
    )


    vi.assert.throws(
      () =>
        zx.deepPartial(
          z.array(
            z.object({
              a: z.string()
            }),
          )
        ).parse(
          [
            { a: 1 }
          ]
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.record(
            z.string(),
            z.object({
              a: z.string()
            })
          )
        ).parse(
          {}
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.record(
            z.string(),
            z.object({
              a: z.string()
            })
          )
        ).parse(
          {
            X: {}
          }
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.record(
            z.string(),
            z.object({
              a: z.string()
            })
          )
        ).parse(
          {
            X: {
              a: undefined
            }
          }
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.record(
            z.string(),
            z.object({
              a: z.string()
            })
          )
        ).parse(
          {
            X: {
              a: ''
            }
          }
        )
    )

    vi.assert.throws(
      () =>
        zx.deepPartial(
          z.record(
            z.string(),
            z.object({
              a: z.string()
            })
          )
        ).parse(
          {
            X: {
              a: 1,
            }
          }
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {}
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: undefined
          }
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: {}
          }
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: {
              b: undefined
            }
          }
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: {
              b: {}
            }
          }
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: {
              b: {
                c: undefined
              }
            }
          }
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: {
              b: {
                c: {}
              }
            }
          }
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: {
              b: {
                c: {
                  d: undefined
                }
              }
            }
          }
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: {
              b: {
                c: {
                  d: {}
                }
              }
            }
          }
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: {
              b: {
                c: {
                  d: {
                    e: undefined
                  }
                }
              }
            }
          }
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: {
              b: {
                c: {
                  d: {
                    e: ''
                  }
                }
              }
            }
          }
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: {
              b: {
                c: {
                  d: {
                    f: undefined
                  }
                }
              }
            }
          }
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: {
              b: {
                c: {
                  d: {
                    f: ''
                  }
                }
              }
            }
          }
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: {
              b: {
                c: {
                  d: {
                    e: undefined,
                    f: ''
                  }
                }
              }
            }
          }
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: {
              b: {
                c: {
                  d: {
                    e: '',
                    f: ''
                  }
                }
              }
            }
          }
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: {
              b: {
                c: {
                  d: {
                    e: '',
                    f: ''
                  },
                  g: undefined
                }
              }
            }
          }
        )
    )

    vi.assert.doesNotThrow(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: {
              b: {
                c: {
                  d: {
                    e: '',
                    f: ''
                  },
                  g: ''
                }
              }
            }
          }
        )
    )

    vi.assert.throws(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: {
              b: {
                c: {
                  d: {
                    e: 1,
                    f: ''
                  },
                  g: ''
                }
              }
            }
          }
        )
    )

    vi.assert.throws(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: {
              b: {
                c: {
                  d: {
                    f: 1
                  },
                  g: ''
                }
              }
            }
          }
        )
    )

    vi.assert.throws(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: {
              b: {
                c: {
                  d: {
                  },
                  g: 1
                }
              }
            }
          }
        )
    )

    vi.assert.throws(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: {
              b: {
                c: {
                  d: 1,
                }
              }
            }
          }
        )
    )

    vi.assert.throws(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: {
              b: {
                c: 1
              }
            }
          }
        )
    )

    vi.assert.throws(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: {
              b: 1
            }
          }
        )
    )

    vi.assert.throws(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          {
            a: 1
          }
        )
    )

    vi.assert.throws(
      () =>
        zx.deepPartial(
          z.object({
            a: z.object({
              b: z.union([
                z.object({
                  c: z.union([
                    z.object({
                      d: z.union([
                        z.object({
                          e: z.string(),
                          f: z.string(),
                        }),
                      ]),
                      g: z.string(),
                    })
                  ])
                })
              ])
            })
          })
        ).parse(
          1
        )
    )

    // #392 https://github.com/traversable/schema/issues/392
    const User = z.strictObject({
      lastLoginDate: z.number().optional().transform(value => value ? new Date(value) : undefined),
    })

    vi.assert.doesNotThrow(() =>
      zx.deepPartial(User).parse({})
    )

    const User2 = z.object({
      lastLoginDate: z.number().optional().transform(value => value ? new Date(value) : undefined),
    })

    vi.assert.doesNotThrow(() =>
      zx.deepPartial(User2).parse({})
    )

    const User3 = z.looseObject({
      lastLoginDate: z.number().optional().transform(value => value ? new Date(value) : undefined),
    })

    vi.assert.doesNotThrow(() =>
      zx.deepPartial(User3).parse({})
    )

    const User4 = z.object({
      one: z.number()
        .int()
        .optional()
        .transform(value => value ? new Date(value) : undefined)
        .optional()
        .transform((x) => x)
        .optional(),
      two: z.number()
        .int()
        .optional()
        .prefault(() => undefined)
        .transform(value => value ? new Date(value) : undefined)
        .optional()
        .transform((x) => x)
        .optional()
        .catch(new Date())
        .default(new Date()),
      three: z.object({
        four: z.number()
          .int()
          .optional()
          .prefault(() => undefined)
          .transform(value => value ? new Date(value) : undefined)
          .transform((x) => x)
          .optional()
          .transform((x) => x)
          .optional()
          .catch(new Date())
          .default(new Date())
          .brand()
          .superRefine((x) => undefined)
      }).optional()
        .transform(() => undefined)
        .transform((x) => x)
        .optional()
        .array()
        .optional()
        .optional()
        .readonly()
        .and(
          z.object({
            six: z.any().transform((x) => x)
          })
        )
        .nullish(),
      seven: z.unknown()
        .optional()
        .nullish()
        .nullable()
        .superRefine(() => undefined)
        .refine((x) => x)
        .optional()
        .optional()
        .transform(() => undefined)
    })

    vi.assert.doesNotThrow(() =>
      zx.deepPartial(User4).parse({})
    )
  })
})
