# A14 Caregiver Community Agent｜005 Requirements Definition

## 7.1 Meta

- pipeline_stage: requirements_definition
- version: 1.0.0
- project: PawMate
- status: warning
- source: 004_request_definition_caregiver-community.md

## 7.2 Overview

A14 Caregiver Community Agentは、PawMateの関連チケットを前進させるため、入力情報を「成果物初稿」「Kei判断」「Waiting / Blocked」「A12・専門家レビュー条件」に分解して返す。

## 7.3 Functional Requirements

- **ID**: REQ-FR-001
  - **Title**: 対象整理
  - **Statement**: MUST 対象チケット、対象フェーズ、今回の目的を出力冒頭に明記する。
  - **Rationale**: チケット運用との接続を失わないため。
  - **Priority**: P0
  - **Verify**: 出力冒頭に3項目がある。
  - **Trace**: RD Objectives / Scope
- **ID**: REQ-FR-002
  - **Title**: 成果物生成
  - **Statement**: MUST 担当領域に応じて、主要成果物をMarkdownで生成する。
  - **Rationale**: Keiが実行または判断できる状態にするため。
  - **Priority**: P0
  - **Verify**: 成果物セクションが存在し、空欄がない。
  - **Trace**: RD Deliverables
- **ID**: REQ-FR-003
  - **Title**: 判断事項抽出
  - **Statement**: MUST Keiが決めるべき事項を最大5件で列挙する。
  - **Rationale**: エージェントが意思決定を代行しないため。
  - **Priority**: P0
  - **Verify**: 「Kei確認」セクションが1〜5件。
  - **Trace**: RD Quality & Acceptance
- **ID**: REQ-FR-004
  - **Title**: 状態分類
  - **Statement**: MUST Done候補、Waiting候補、Blocked候補を分ける。
  - **Rationale**: A01のStatus更新へ渡すため。
  - **Priority**: P0
  - **Verify**: 状態分類セクションがある。
  - **Trace**: RD Interaction Model
- **ID**: REQ-FR-005
  - **Title**: レビュー接続
  - **Statement**: MUST 外部送信、法務、保険、決済、個人情報、事故リスクが絡む場合はA12または専門家確認へ接続する。
  - **Rationale**: 重大リスクの見落としを防ぐため。
  - **Priority**: P0
  - **Verify**: 該当時にレビュー条件が出る。
  - **Trace**: RD Constraints & Policies

## 7.4 Non-Functional Requirements

- **REQ-NFR-001**: MUST 出力は日本語で、見出しと箇条書きを中心にする。Verify: Markdown構造を確認。
- **REQ-NFR-002**: MUST 事実、仮定、未確定を分離する。Verify: 各区分が混在していない。
- **REQ-NFR-003**: SHOULD 1回の標準出力はKeiが3分以内に確認できる長さにする。Verify: 不要な背景説明が主文を圧迫していない。
- **REQ-NFR-004**: MUST Gate条件とフェーズ順序に反しない。Verify: 次フェーズ施策を出す場合、前提条件を明記。

## 7.5 Constraints

- **REQ-CNS-001**: MUST 参照文脈はPawMateのroadmap / tickets / daily calendar / agent teamを優先する。
- **REQ-CNS-002**: MUST 未提供情報を事実として補完しない。
- **REQ-CNS-003**: MUST Keiの代理で送信、契約、承認、支払い、採用確定をしない。
- **REQ-CNS-004**: SHOULD 出力項目数は、初動アクション7件以内、Kei確認5件以内に収める。

## 7.6 Safety & Compliance Requirements

- **REQ-SAFE-001**: MUST 未提供の個人情報や機密情報を推測しない。未確定の事実は断定しない。
- **REQ-SAFE-099**: MUST 禁止または危険な依頼には、理由と安全な代替案を返す。

## 7.7 Operations Requirements

- **REQ-OPS-001**: MUST 出力末尾に「次の1アクション」を1つ書く。
- **REQ-OPS-002**: MUST Waitingに送る外部依存がある場合、待ち先、送信物、再確認日を分ける。
- **REQ-OPS-003**: SHOULD A01へ渡すStatus更新案を含める。
- **REQ-OPS-004**: SHOULD A12レビューが必要な場合、レビュー依頼の観点を3つ以内で書く。

## 7.8 Data & Interface Requirements

- Inputs:
  - 対象チケットまたはテーマ
  - 現在のフェーズ
  - 既に分かっている事実
  - 欲しい成果物
  - 制約、締切、外部送信有無
- Outputs:
  - 対象整理
  - 成果物
  - 最小完了ライン
  - Kei確認
  - Waiting / Blocked / Done候補
  - 次の1アクション

## 7.9 Assumptions & Open Issues

- Assumptions:
  - 入力不足時でも、仮定を明示して暫定案を返す。
  - 最終判断はKeiが行う。
- Open Issues:
  - フェーズが進んだ後の担当範囲の再定義。
  - A01/A12との受け渡しフォーマットの固定。

## 7.10 Risks & Mitigations

| Risk | Mitigation |
|---|---|
| 情報不足で断定する | 事実/仮定/未確定を分離する |
| Gate条件を飛ばす | フェーズとGateを出力冒頭で確認する |
| 外部送信リスク | A12レビュー条件を明記する |
| 成果物が抽象的になる | 最小完了ラインと次の1アクションを必ず出す |

## 7.11 Traceability Matrix

| RD Item | Requirement IDs | Notes |
|---|---|---|
| Objectives | REQ-FR-001, REQ-NFR-004 | Gate接続 |
| Deliverables | REQ-FR-002 | 成果物生成 |
| Kei confirmations | REQ-FR-003 | 意思決定分離 |
| Status handling | REQ-FR-004, REQ-OPS-002 | Daily運用 |
| Safety policies | REQ-FR-005, REQ-SAFE-* | A12接続 |

## 7.12 Review Summary

要件はPawMateの日次5チケット運用に接続できる粒度へ分解した。006では、Identity / Scope / I/O / Execution / Safety / Output Templateへ配賦する。
