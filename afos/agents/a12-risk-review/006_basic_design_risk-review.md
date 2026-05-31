# A12 Risk Review Agent｜006 Basic Design

## 6.1 Meta

- pipeline_stage: basic_design
- version: 1.0.0
- project: PawMate
- status: ok

## 6.2 Architecture Summary

この基本設計は、A12 Risk Review AgentをPawMateの日次チケット運用へ組み込むためのプロンプト構造である。最終プロンプトは、役割、PawMate文脈、担当範囲、入出力契約、実行順、協働、安全、品質、出力テンプレートの10章で構成する。

重要な設計判断:

- Gate条件とフェーズ順序を全章の前提に置く。
- Keiの最終意思決定は代行しない。
- 成果物だけでなく、Waiting / Blocked / Kei確認を必ず出す。
- A12レビュー条件を安全章へ集約する。

## 6.3 Section Map

| Section | Name | Purpose |
|---|---|---|
| SEC-01 | Identity | 役割・ミッション・最終責任の境界を固定する |
| SEC-02 | PawMate Context | ロードマップ、チケット、Gate、日次運用との接続を固定する |
| SEC-03 | Scope | 担当範囲と非対応範囲を分ける |
| SEC-04 | Input Contract | 最低入力と不足時の扱いを定義する |
| SEC-05 | Output Contract | 成果物と判断支援の出力構造を固定する |
| SEC-06 | Execution Flow | 処理順序を定義する |
| SEC-07 | Collaboration | A01/A12/他専門エージェントとの受け渡しを定義する |
| SEC-08 | Safety & Escalation | 禁止、断定回避、レビュー条件を固定する |
| SEC-09 | Quality Gate | 出力前セルフチェックを定義する |
| SEC-10 | Output Template | ユーザーに返す標準フォーマットを定義する |

## 6.4 Section Specs

### SEC-01 Identity

- Purpose: 役割・ミッション・最終責任の境界を固定する
- Inputs: 004 Request Definition, 005 Requirements Definition, pawmate_agent_team.md
- Outputs: 最終プロンプト本文のIdentity章
- Rules:
  - P0/P1要件を優先する。
  - 事実、仮定、未確定を混ぜない。
  - Gate条件に反する文言を入れない。
- Failure Handling:
  - 不足は追加確認へ倒す。
  - リスクはA12または専門家確認へ倒す。
- Review Checklist:
  - 章の目的が他章と重複していない。
  - 必須要件を落としていない。
  - Keiの判断代行になっていない。
- Trace: REQ-FR-001〜005, REQ-CNS-001〜004, REQ-SAFE-*, REQ-OPS-001〜004

### SEC-02 PawMate Context

- Purpose: ロードマップ、チケット、Gate、日次運用との接続を固定する
- Inputs: 004 Request Definition, 005 Requirements Definition, pawmate_agent_team.md
- Outputs: 最終プロンプト本文のPawMate Context章
- Rules:
  - P0/P1要件を優先する。
  - 事実、仮定、未確定を混ぜない。
  - Gate条件に反する文言を入れない。
- Failure Handling:
  - 不足は追加確認へ倒す。
  - リスクはA12または専門家確認へ倒す。
- Review Checklist:
  - 章の目的が他章と重複していない。
  - 必須要件を落としていない。
  - Keiの判断代行になっていない。
- Trace: REQ-FR-001〜005, REQ-CNS-001〜004, REQ-SAFE-*, REQ-OPS-001〜004

### SEC-03 Scope

- Purpose: 担当範囲と非対応範囲を分ける
- Inputs: 004 Request Definition, 005 Requirements Definition, pawmate_agent_team.md
- Outputs: 最終プロンプト本文のScope章
- Rules:
  - P0/P1要件を優先する。
  - 事実、仮定、未確定を混ぜない。
  - Gate条件に反する文言を入れない。
- Failure Handling:
  - 不足は追加確認へ倒す。
  - リスクはA12または専門家確認へ倒す。
- Review Checklist:
  - 章の目的が他章と重複していない。
  - 必須要件を落としていない。
  - Keiの判断代行になっていない。
- Trace: REQ-FR-001〜005, REQ-CNS-001〜004, REQ-SAFE-*, REQ-OPS-001〜004

### SEC-04 Input Contract

- Purpose: 最低入力と不足時の扱いを定義する
- Inputs: 004 Request Definition, 005 Requirements Definition, pawmate_agent_team.md
- Outputs: 最終プロンプト本文のInput Contract章
- Rules:
  - P0/P1要件を優先する。
  - 事実、仮定、未確定を混ぜない。
  - Gate条件に反する文言を入れない。
- Failure Handling:
  - 不足は追加確認へ倒す。
  - リスクはA12または専門家確認へ倒す。
- Review Checklist:
  - 章の目的が他章と重複していない。
  - 必須要件を落としていない。
  - Keiの判断代行になっていない。
- Trace: REQ-FR-001〜005, REQ-CNS-001〜004, REQ-SAFE-*, REQ-OPS-001〜004

### SEC-05 Output Contract

- Purpose: 成果物と判断支援の出力構造を固定する
- Inputs: 004 Request Definition, 005 Requirements Definition, pawmate_agent_team.md
- Outputs: 最終プロンプト本文のOutput Contract章
- Rules:
  - P0/P1要件を優先する。
  - 事実、仮定、未確定を混ぜない。
  - Gate条件に反する文言を入れない。
- Failure Handling:
  - 不足は追加確認へ倒す。
  - リスクはA12または専門家確認へ倒す。
- Review Checklist:
  - 章の目的が他章と重複していない。
  - 必須要件を落としていない。
  - Keiの判断代行になっていない。
- Trace: REQ-FR-001〜005, REQ-CNS-001〜004, REQ-SAFE-*, REQ-OPS-001〜004

### SEC-06 Execution Flow

- Purpose: 処理順序を定義する
- Inputs: 004 Request Definition, 005 Requirements Definition, pawmate_agent_team.md
- Outputs: 最終プロンプト本文のExecution Flow章
- Rules:
  - P0/P1要件を優先する。
  - 事実、仮定、未確定を混ぜない。
  - Gate条件に反する文言を入れない。
- Failure Handling:
  - 不足は追加確認へ倒す。
  - リスクはA12または専門家確認へ倒す。
- Review Checklist:
  - 章の目的が他章と重複していない。
  - 必須要件を落としていない。
  - Keiの判断代行になっていない。
- Trace: REQ-FR-001〜005, REQ-CNS-001〜004, REQ-SAFE-*, REQ-OPS-001〜004

### SEC-07 Collaboration

- Purpose: A01/A12/他専門エージェントとの受け渡しを定義する
- Inputs: 004 Request Definition, 005 Requirements Definition, pawmate_agent_team.md
- Outputs: 最終プロンプト本文のCollaboration章
- Rules:
  - P0/P1要件を優先する。
  - 事実、仮定、未確定を混ぜない。
  - Gate条件に反する文言を入れない。
- Failure Handling:
  - 不足は追加確認へ倒す。
  - リスクはA12または専門家確認へ倒す。
- Review Checklist:
  - 章の目的が他章と重複していない。
  - 必須要件を落としていない。
  - Keiの判断代行になっていない。
- Trace: REQ-FR-001〜005, REQ-CNS-001〜004, REQ-SAFE-*, REQ-OPS-001〜004

### SEC-08 Safety & Escalation

- Purpose: 禁止、断定回避、レビュー条件を固定する
- Inputs: 004 Request Definition, 005 Requirements Definition, pawmate_agent_team.md
- Outputs: 最終プロンプト本文のSafety & Escalation章
- Rules:
  - P0/P1要件を優先する。
  - 事実、仮定、未確定を混ぜない。
  - Gate条件に反する文言を入れない。
- Failure Handling:
  - 不足は追加確認へ倒す。
  - リスクはA12または専門家確認へ倒す。
- Review Checklist:
  - 章の目的が他章と重複していない。
  - 必須要件を落としていない。
  - Keiの判断代行になっていない。
- Trace: REQ-FR-001〜005, REQ-CNS-001〜004, REQ-SAFE-*, REQ-OPS-001〜004

### SEC-09 Quality Gate

- Purpose: 出力前セルフチェックを定義する
- Inputs: 004 Request Definition, 005 Requirements Definition, pawmate_agent_team.md
- Outputs: 最終プロンプト本文のQuality Gate章
- Rules:
  - P0/P1要件を優先する。
  - 事実、仮定、未確定を混ぜない。
  - Gate条件に反する文言を入れない。
- Failure Handling:
  - 不足は追加確認へ倒す。
  - リスクはA12または専門家確認へ倒す。
- Review Checklist:
  - 章の目的が他章と重複していない。
  - 必須要件を落としていない。
  - Keiの判断代行になっていない。
- Trace: REQ-FR-001〜005, REQ-CNS-001〜004, REQ-SAFE-*, REQ-OPS-001〜004

### SEC-10 Output Template

- Purpose: ユーザーに返す標準フォーマットを定義する
- Inputs: 004 Request Definition, 005 Requirements Definition, pawmate_agent_team.md
- Outputs: 最終プロンプト本文のOutput Template章
- Rules:
  - P0/P1要件を優先する。
  - 事実、仮定、未確定を混ぜない。
  - Gate条件に反する文言を入れない。
- Failure Handling:
  - 不足は追加確認へ倒す。
  - リスクはA12または専門家確認へ倒す。
- Review Checklist:
  - 章の目的が他章と重複していない。
  - 必須要件を落としていない。
  - Keiの判断代行になっていない。
- Trace: REQ-FR-001〜005, REQ-CNS-001〜004, REQ-SAFE-*, REQ-OPS-001〜004


## 6.5 Requirements-to-Sections Matrix

| REQ ID | Priority | Section ID | Notes |
|---|---|---|---|
| REQ-FR-001 | P0 | SEC-02, SEC-04 | 対象整理 |
| REQ-FR-002 | P0 | SEC-05, SEC-10 | 成果物生成 |
| REQ-FR-003 | P0 | SEC-05, SEC-10 | Kei確認 |
| REQ-FR-004 | P0 | SEC-06, SEC-10 | 状態分類 |
| REQ-FR-005 | P0 | SEC-08 | レビュー接続 |
| REQ-NFR-001〜004 | P0/P1 | SEC-09, SEC-10 | 品質 |
| REQ-CNS-001〜004 | P0/P1 | SEC-02, SEC-03 | 制約 |
| REQ-SAFE-* | P0 | SEC-08 | 安全 |
| REQ-OPS-001〜004 | P0/P1 | SEC-06, SEC-07, SEC-10 | 運用 |

## 6.6 Open Issues & Next Decisions

- A01へ渡すStatus更新フォーマットの共通化。
- A12レビュー対象を自動判定するキーワードの精緻化。
- フェーズ進行後の担当範囲見直し。

## 6.7 Review Summary

10章構成で、008ドラフトへ迷わず進める骨格を作った。007では各SECの本文テンプレ、分岐、不足・矛盾時処理、出力テンプレートを確定する。
