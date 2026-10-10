### 🟢 e2e: 12 passed
10 agent steps · 4 replayed from cache · 8 model calls · 23.1k tokens

<details>
<summary>All 12 tests in 6 files</summary>

|  | Test | Agent | Time |
| --- | --- | --- | --- |
| 🟢 | **tests/counter.agent.e2e.ts** · 1 passed | 2 steps · 1 call | 13.9s |
| 🟢 | the agent counts to the limit | 2 steps · 1 call | 13.9s |
| 🟢 | **tests/counter.e2e.ts** · 2 passed |  | 738ms |
| 🟢 | counts up by one |  | 532ms |
| 🟢 | resets to zero |  | 206ms |
| 🟢 | **tests/greeting.agent.e2e.ts** · 2 passed | 4 steps · 2 calls | 1m 10s |
| 🟢 | the agent gets a greeting | 2 steps · 1 call | 11.9s |
| 🟢 | the agent finds the empty-name error | 2 steps · 1 call | 58.5s |
| 🟢 | **tests/greeting.e2e.ts** · 3 passed |  | 835ms |
| 🟢 | shows the greeting form |  | 415ms |
| 🟢 | asks for a name when the field is empty |  | 218ms |
| 🟢 | greets the name you type |  | 202ms |
| 🟢 | **tests/notes.agent.e2e.ts** · 2 passed | 4 steps · 5 calls | 1m 26s |
| 🟢 | the agent keeps a note | 2 steps · 1 call | 13.0s |
| 🟢 | the agent removes a note | 2 steps · 4 calls | 1m 13s |
| 🟢 | **tests/notes.e2e.ts** · 2 passed |  | 655ms |
| 🟢 | starts with no notes |  | 412ms |
| 🟢 | adds a note |  | 243ms |
</details>

<sub>e2e 0.19.0 · 1m 27s · web</sub>
