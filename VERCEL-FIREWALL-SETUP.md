# Vercel Firewall Setup Guide

## ✅ Already Configured (via vercel.json)

**3 WAF Custom Rules** (using `challenge` action):
1. **Block Bot User-Agents** - Challenges requests with bot-like User-Agents
2. **Block Missing Browser Headers** - Challenges requests with `Accept: */*` AND no `Accept-Language`
3. **Block Self-Referer Video Searches** - Challenges requests searching for video titles (contains `|`)

These rules are deployed automatically with your code.

---

## 🔧 Manual Configuration Required (Vercel Dashboard)

### 1. Rate Limiting (1 Rule)

**Reference:** https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting#get-started

**Steps:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → **Firewall** tab
2. Click **Configure** (top right) → **+ New Rule**
3. Configure as follows:
   - **Name:** `API Search Rate Limit`
   - **If condition:** Path equals `/api/search`
   - **Then action:** Rate Limit
   - **Limiting strategy:** Fixed Window
   - **Time Window:** `60s`
   - **Request Limit:** `10 requests`
   - **Match key:** IP
   - **Follow-up action:** Challenge (or 429 Default)
4. Click **Save Rule**
5. Click **Review Changes** → **Publish**

**Pricing:** $0.50 per 1M allowed requests (after 1M free included requests)

**Limits:**
- Hobby: 1 rate limit rule per project
- Pro: 40 rate limit rules per project

---

### 2. IP Blocking (Optional - 10 Blocks Available)

**Reference:** https://vercel.com/docs/vercel-firewall/vercel-waf/ip-blocking

**Steps:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → **Firewall** tab
2. Click **IP Blocking** section
3. Monitor your logs for repeat offenders, then add their IPs

**When to use:**
- Block specific IPs that repeatedly trigger your firewall rules
- Block known malicious IP ranges
- Block persistent bot networks

**Note:** Start monitoring first - only block IPs after you confirm they're malicious.

---

## 📊 Monitoring & Testing

### Best Practice (from Vercel docs):
1. **Start with `log` action** to observe traffic behavior
2. **Monitor for 10 minutes** using Firewall overview
3. **Update to `challenge` or `deny`** once satisfied

### Current Setup:
- ✅ Using `challenge` action (allows legitimate users to prove they're human)
- ✅ Deployed via `vercel.json` (version controlled)
- ⏳ Rate limiting needs Dashboard configuration (can't be done via vercel.json)

### To monitor:
1. Go to **Firewall** tab in your project
2. Select your custom rule from the traffic grouping dropdown
3. Observe blocked/challenged requests in real-time

---

## 💰 Cost Savings

**Before:** Bots hitting your API routes = function invocations = $$

**After:**
- Bots challenged at edge = FREE (no function invocation)
- Only legitimate traffic reaches your API
- Rate limiting prevents abuse

**Expected savings:** 70-90% reduction in function invocations

