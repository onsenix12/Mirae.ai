# PRD.md

## 1) Overview
We are building a **private, AI-powered conversational space** for **Korean high school students** to safely explore academic-path uncertainty **before early course commitments** under the High School Credit System. The product exists to reduce **fear-driven decision-making** by enabling honest, non-judgmental self-reflection—without advice, evaluation, or visibility.

---

## 2) Goals (Outcome-Based, Testable)

**G1. Fear Reduction at Decision Moment**  
Students feel less panic and urgency when thinking about April course selection.

**G2. Honest Private Exploration**  
Students can express doubts they would not share with parents, teachers, or peers.

**G3. Fit vs. Fear Clarity**  
Students can articulate whether uncertainty comes from mismatch or social fear.

**G4. Repeat Reflective Use**  
Students want to return during multiple moments of doubt, not just once.

---

## 3) Non-Goals (Explicit Exclusions)

- Recommending courses, majors, careers, or universities  
- Evaluating aptitude, readiness, or “correctness”  
- Optimizing CSAT scores or admissions outcomes  
- Replacing counselors, parents, or teachers  
- Providing therapy, diagnosis, or treatment  
- Encouraging rebellion or non-prestige paths  
- Forcing convergence or decisions  
- Creating permanent academic or psychological records  
- Integrating with schools, government, or hagwons  
- Social features, sharing, or peer comparison  
- Dashboards or reports for adults or institutions  

---

## 4) Audience

**Primary User (single):**  
Korean high school **Year 1 student (age ~15–16)** approaching **April course selection** under the High School Credit System.

**Motivations**
- Reduce fear of irreversible mistakes  
- Think honestly without judgment  
- Hold multiple plausible futures internally  

**Constraints**
- High parental and social pressure  
- Fear of visibility or records  
- Limited trust in institutional tools  
- Uses the product privately, often late at night  

---

## 5) Existing Solutions & Issues

**Current Options**
- Government platforms (CareerNet, WorkNet)  
- School counselors  
- Hagwon counseling  
- Peer forums / online search  

**Why They Fail**
- Evaluative rather than exploratory  
- Visible, recorded, or institution-linked  
- Assume readiness to declare intent  
- Transactional or one-time  
- Push early clarity instead of tolerating ambiguity  

---

## 6) Assumptions

**A1. Privacy Enables Honesty**  
- *Belief:* Students explore honestly only when social cost is zero.  
- *Why:* Cultural norms equate uncertainty with weakness.  
- *Hackathon Test:* Users disclose doubts they say they wouldn’t tell adults.

**A2. Reflection Without Advice Is Valuable**  
- *Belief:* Clarity and relief can emerge without recommendations.  
- *Why:* Goal is internal orientation, not optimization.  
- *Hackathon Test:* Post-use self-report of insight or calm.

**A3. Staying on the Same Path Is Success**  
- *Belief:* Exploration does not require changing paths.  
- *Why:* Outcome is fear reduction, not switching.  
- *Hackathon Test:* Users feel better even when choosing conventionally.

---

## 7) Constraints

**Non-Negotiable**
- Psychological safety (no judgment, no records, no visibility)  
- No institutional affiliation or implied authority  
- Minimal onboarding; usable immediately  
- Responsible handling of distress signals  
- Low or zero cost to students  

**Assumed Hackathon Constraints (Labeled)**
- Timebox: ~48–72 hours  
- Demo: live end-to-end conversational flow  
- Team: small, limited infra, no real student data  

---

## 8) Key Use Cases

**UC1.** User explores multiple plausible futures to reduce panic (G1, G2)  
**UC2.** User revisits doubts across days/weeks to process uncertainty (G4)  
**UC3.** User reflects before course selection to frame choice as learning (G1, G3)  
**UC4.** User prepares emotionally before talking to parents/counselors (G2)  
**UC5.** User reflects during late-night anxiety when no support is available (G1)

---

## 9) Requirements

### P0 — Must Work in Demo

**R1. Private Reflective Conversation**  
- *Acceptance:* No sharing, profiles, or persistence beyond session  
- *Traceability:* G2, UC1

**R2. Non-Evaluative Interaction**  
- *Acceptance:* No scoring, labeling, or “best path” language  
- *Traceability:* G3, UC1

**R3. Supports Ongoing Reflection**  
- *Acceptance:* No forced conclusions or decisions  
- *Traceability:* G4, UC2

**R4. Psychological Safety Signals**  
- *Acceptance:* Language consistently reinforces “no judgment, no commitment”  
- *Traceability:* G1, UC3

### P1 — Nice to Have

**R5. Fit vs. Fear Prompting**  
- *Acceptance:* User articulates source of doubt in their own words  
- *Traceability:* G3, UC3

**R6. Pre-Conversation Clarity**  
- *Acceptance:* User reports feeling more prepared to talk to adults  
- *Traceability:* G2, UC4

---

## 10) Research Notes

- Structural counselor shortage is persistent  
- Cultural prestige pressure will remain  
- Core risk: drifting into advice or evaluation  
- Unknown: optimal conversation length for fear reduction  

---

## 11) Open Questions / Decisions Needed

1. What is the **single demo moment** judges must remember?  
2. How do we **signal safety within 10 seconds**?  
3. What is the **minimum signal** that fear has reduced?

---

## 12) PRD Quality Check

- **Explainable in 60 seconds?** YES — private sensemaking before commitment  
- **Scope-limited?** YES — reflection only, no advice or outcomes  
- **Clear what NOT to do?** YES — extensive Non-Goals  

---
End of PRD.md