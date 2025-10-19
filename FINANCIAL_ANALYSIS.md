# Financial Analysis & Funding Requirements

## Executive Summary

**What Is This?** is a freemium AI-powered PWA targeting seniors and non-English speakers. This document outlines funding requirements, operating costs, and runway projections.

---

## Revenue Model

### Pricing Tiers (October 2025)
| Tier | Price | Daily Limit | Monthly Max | Cost (Full Usage) | Gross Margin |
|------|-------|-------------|-------------|-------------------|--------------|
| **Free** | $0 | 0* | 3/month | $0.09 | -100% (lead gen) |
| **Daily** | $0.49/day | 10 | 300 | $9.00 | **39%** |
| **Weekly** | $2.99/week | 10 | 280 | $8.40 | **30%** |
| **Monthly** | $12.99/month | 10 | 300 | $9.00 | **31%** |
| **Pro** | $25.99/month | 20 | 600 | $18.00 | **31%** |
| **Annual** | $144.99/year | 10 | 3,650 | $109.50 | **25%** |

*Free tier: 3 analyses per month (not daily)

**Key Metrics:**
- **Average margin**: 31% across paid tiers
- **OpenAI cost per analysis**: $0.03 (current rate)
- **Break-even**: 1 analysis per user (Daily tier)
- **Target market**: 2M+ English speakers aged 65+ in US (2025)

---

## Operating Costs Breakdown

### 1. Personnel Costs

#### Year 1 (Bootstrap Mode)

| Role | Monthly | Annual | Notes |
|------|---------|--------|-------|
| **You (Founder/Developer)** | $6,000 | $72,000 | Below-market founder salary |
| **Virtual Assistant** | $1,200 | $14,400 | 20hrs/week, offshore (customer support, content) |
| **Freelance Designer** | $500 | $6,000 | As-needed (icons, marketing assets) |
| **TOTAL PERSONNEL** | **$7,700** | **$92,400** | |

#### Year 2 (Growth Mode)

| Role | Monthly | Annual | Notes |
|------|---------|--------|-------|
| **You (Founder/CTO)** | $10,000 | $120,000 | Market-rate salary |
| **Full-Stack Developer** | $8,000 | $96,000 | Senior hire (features, scaling) |
| **Customer Success Manager** | $5,000 | $60,000 | Full-time onshore |
| **Virtual Assistant** | $1,500 | $18,000 | 30hrs/week (admin, moderation) |
| **TOTAL PERSONNEL** | **$24,500** | **$294,000** | |

---

### 2. Technology Costs

#### Monthly Recurring (Average)

| Service | Users | Monthly Cost | Notes |
|---------|-------|--------------|-------|
| **OpenAI API** | | | |
| - 0-1K users | 1,000 | $50-200 | ~100-500 analyses/day |
| - 1K-10K users | 5,000 | $500-2,000 | ~1,500 analyses/day |
| - 10K-50K users | 25,000 | $5,000-15,000 | ~7,500 analyses/day |
| **Replit Autoscale** | | $0-500 | Scales with traffic, starts free |
| **Neon Database** | | $0-100 | Serverless PostgreSQL |
| **Resend Email** | | $0-20 | 3K free/month, $20 for 50K |
| **Stripe Fees** | | 2.9% + 30¢ | Per transaction |
| **Domain + SSL** | | $1-5 | Annual cost amortized |
| **Monitoring (Sentry)** | | $0-50 | Free tier → $26/month |
| **TOTAL (Year 1)** | **1K users** | **$100-400** | Conservative estimate |
| **TOTAL (Year 2)** | **10K users** | **$1,000-3,000** | Growth phase |

**Note**: OpenAI is the dominant variable cost. Monitor usage closely!

---

### 3. Marketing & Customer Acquisition

#### Year 1 (Organic + Low-Cost)

| Channel | Monthly | Annual | CAC | Notes |
|---------|---------|--------|-----|-------|
| **Content Marketing** | $200 | $2,400 | $2-5 | Blog, YouTube tutorials |
| **Reddit/Forums** | $0 | $0 | Free | r/seniors, r/ESL communities |
| **App Store Optimization** | $100 | $1,200 | - | Keywords, screenshots |
| **Referral Program** | 5% revenue | $3,000 | $1-3 | Give 5 free analyses |
| **TOTAL MARKETING** | **$300** | **$6,600** | **~$3** | Organic-first strategy |

#### Year 2 (Paid Acquisition)

| Channel | Monthly | Annual | CAC | Notes |
|---------|---------|--------|-----|-------|
| **Meta Ads** | $2,000 | $24,000 | $8-15 | Facebook/Instagram (seniors) |
| **Google Ads** | $1,500 | $18,000 | $10-20 | Search keywords |
| **Influencer Partnerships** | $500 | $6,000 | $5-10 | Senior content creators |
| **Content Marketing** | $500 | $6,000 | $2-5 | SEO, blog, videos |
| **Referral Program** | 5% revenue | $6,000 | $1-3 | Improved incentives |
| **TOTAL MARKETING** | **$4,500** | **$60,000** | **~$10** | Blended CAC |

---

## Total Operating Expenses

### Year 1 (Bootstrap)
| Category | Monthly | Annual |
|----------|---------|--------|
| Personnel | $7,700 | $92,400 |
| Technology | $300 | $3,600 |
| Marketing | $300 | $6,600 |
| Legal/Accounting | $200 | $2,400 |
| Miscellaneous | $500 | $6,000 |
| **TOTAL** | **$9,000** | **$111,000** |

### Year 2 (Growth)
| Category | Monthly | Annual |
|----------|---------|--------|
| Personnel | $24,500 | $294,000 |
| Technology | $2,000 | $24,000 |
| Marketing | $4,500 | $60,000 |
| Legal/Accounting | $500 | $6,000 |
| Miscellaneous | $1,000 | $12,000 |
| **TOTAL** | **$32,500** | **$396,000** |

---

## Revenue Projections

### Conservative Scenario

**Assumptions:**
- 60% free tier (never convert)
- 25% Daily/Weekly
- 10% Monthly
- 4% Pro
- 1% Annual
- 3% monthly churn
- 50 signups/day Year 1 → 200/day Year 2

| Metric | Month 3 | Month 6 | Month 12 | Month 24 |
|--------|---------|---------|----------|----------|
| **Total Users** | 1,500 | 4,500 | 18,000 | 72,000 |
| **Paid Users** | 600 | 1,800 | 7,200 | 28,800 |
| **MRR** | $4,320 | $12,960 | $51,840 | $207,360 |
| **ARR** | $51,840 | $155,520 | $622,080 | $2,488,320 |
| **Gross Profit** | $1,340 | $4,020 | $16,070 | $64,280/mo |
| **Burn Rate** | -$7,660 | -$4,980 | +$7,070 | +$31,780/mo |
| **Cumulative Cash** | -$23K | -$53K | -$13K | +$367K |

**Break-even**: Month 11 (~6,500 paid users)

### Optimistic Scenario

**Assumptions:**
- 50% free tier
- Viral coefficient 1.2
- 2% monthly churn
- 100 signups/day Year 1 → 500/day Year 2

| Metric | Month 3 | Month 6 | Month 12 | Month 24 |
|--------|---------|---------|----------|----------|
| **Total Users** | 3,000 | 9,000 | 36,000 | 180,000 |
| **Paid Users** | 1,500 | 4,500 | 18,000 | 90,000 |
| **MRR** | $10,800 | $32,400 | $129,600 | $648,000 |
| **ARR** | $129,600 | $388,800 | $1,555,200 | $7,776,000 |
| **Gross Profit** | $3,348 | $10,044 | $40,176 | $200,880/mo |
| **Burn Rate** | -$5,652 | -$856 | +$31,176 | +$168,380/mo |
| **Cumulative Cash** | -$17K | -$26K | +$207K | +$2.2M |

**Break-even**: Month 7 (~3,200 paid users)

---

## Funding Requirements

### Option 1: Bootstrap (Recommended)

**Runway Needed**: **$120,000** (12 months)

**Sources:**
- Personal savings: $50K
- Friends & family: $30K
- Credit line: $20K
- Side consulting: $20K

**Milestones:**
- Month 6: 2,000 paid users, $14K MRR
- Month 12: Break-even at $52K MRR
- Month 18: Profitable, consider raising for growth

**Pros:**
- No dilution
- Full control
- Lean operation forces discipline

**Cons:**
- Slow growth
- High personal risk
- Limited marketing budget

---

### Option 2: Pre-Seed Raise

**Amount**: **$300,000-$500,000**

**Dilution**: 10-15% equity

**Use of Funds:**
| Allocation | Amount | Purpose |
|------------|--------|---------|
| Personnel | $150K | Junior dev + customer success |
| Marketing | $100K | Paid acquisition, PR |
| Technology | $30K | OpenAI buffer, infrastructure |
| Operations | $20K | Legal, accounting, tools |
| Runway Buffer | $100K | 12+ months cash |

**Target Milestones:**
- Month 6: 5,000 paid users, $36K MRR
- Month 12: 15,000 paid users, $108K MRR
- Month 18: Series A fundraising

**Investor Targets:**
- Y Combinator (batch application)
- Techstars (accelerator program)
- Angel investors in senior tech/accessibility
- Micro VCs ($250K-$1M check size)

---

## Break-Even Analysis

### Per-User Economics

| Metric | Free | Daily | Monthly | Pro |
|--------|------|-------|---------|-----|
| **Revenue** | $0 | $14.70/mo | $12.99 | $25.99 |
| **Cost (Full Usage)** | $0.09 | $9.00 | $9.00 | $18.00 |
| **Gross Profit** | -$0.09 | $5.70 | $3.99 | $7.99 |
| **GM%** | -100% | 39% | 31% | 31% |

**Required Paid Users for Break-Even (Year 1):**
- Monthly burn: $9,000
- Average gross profit per paid user: $5.89
- **Required paid users**: ~1,530
- At 40% paid conversion: **3,825 total users**

**Timeline to Break-Even:**
- 50 signups/day: **77 days** (2.5 months)
- 100 signups/day: **39 days** (1.3 months)
- 200 signups/day: **19 days** (0.6 months)

---

## Risk Mitigation

### Cost Risks

1. **OpenAI Price Increase**
   - **Risk**: OpenAI raises prices 50%
   - **Impact**: Margins drop to 15-20%
   - **Mitigation**: 
     - Increase prices $1-2 per tier
     - Switch to cheaper models (GPT-4o mini)
     - Implement aggressive caching

2. **Higher CAC Than Expected**
   - **Risk**: CAC jumps to $20-30
   - **Impact**: Payback period 4-6 months
   - **Mitigation**:
     - Focus on organic channels
     - Improve referral program
     - Optimize onboarding conversion

3. **Payment Processing Fees**
   - **Risk**: Stripe fees (2.9% + 30¢) eat 5-10% revenue
   - **Impact**: Lower margins on small plans
   - **Mitigation**:
     - Encourage Annual plans (fewer transactions)
     - Negotiate volume discount at $100K/month

---

## Recommendations

### Immediate (Month 1-3)
1. **Launch with bootstrap budget** ($120K)
2. **Target 50 signups/day** via:
   - Reddit communities (r/seniors, r/ESL)
   - Content marketing (YouTube tutorials)
   - Word of mouth / referrals
3. **Monitor metrics daily**:
   - Conversion rate (Free → Paid)
   - OpenAI costs per user
   - Churn rate

### Short-term (Month 4-6)
1. **Hit 2,000 paid users** ($14K MRR)
2. **Optimize pricing** based on data
3. **Reduce churn** to <3%/month
4. **Consider** raising $300K if growth is strong

### Long-term (Month 12+)
1. **Reach profitability** ($52K+ MRR)
2. **Expand marketing** (paid ads)
3. **Hire full-time team**
4. **Prepare for Series A** if scaling to 100K+ users

---

## Summary

**Minimum Viable Funding**: **$120,000** (bootstrap, 12 months)

**Recommended Raise**: **$300,000-$500,000** (pre-seed, 18 months)

**Break-Even**: **1,530 paid users** (~3,825 total)

**Time to Profitability**: **7-12 months** (depending on growth rate)

**Total Team Cost Year 1**: **$92,400** (You + VA)

**Total OpEx Year 1**: **$111,000** (including all costs)

**Key Success Factors:**
1. Keep OpenAI costs <$0.04/analysis
2. Maintain 30%+ gross margins
3. Achieve <5% monthly churn
4. Hit 50+ signups/day organically
5. Convert 40%+ free users to paid

---

**Next Steps:**
1. Finalize budget allocation
2. Set up financial tracking (Stripe Dashboard + spreadsheet)
3. Open business bank account
4. Consider incorporation (LLC or C-Corp if raising)
5. Create investor deck if pursuing funding
