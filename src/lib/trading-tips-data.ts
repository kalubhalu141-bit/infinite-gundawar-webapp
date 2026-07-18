/* ═══════════════════════════════════════════════
   EXPANDED TRADING TIPS & TRICKS DATA
   ═══════════════════════════════════════════════ */

export interface TradingTip {
  id: number
  title: string
  category: string
  icon: string
  content: string
  proTip: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
}

export const TRADING_TIPS: TradingTip[] = [
  // ═══════════════════════════════════════════
  // RISK MANAGEMENT (1-15)
  // ═══════════════════════════════════════════
  { id: 1, title: 'The 1% Rule \u2014 Never Risk More Than 1% Per Trade', category: 'Risk Management', icon: '\U0001f6e1\ufe0f',
    content: 'If you have \u20b91,00,000 capital, never risk more than \u20b91,000 on a single trade. This means even if you lose 10 trades in a row, you still have 90% of your capital. Professional traders live by this rule.',
    proTip: 'Use position sizing calculators. Risk = (Entry - Stop Loss) \u00d7 Quantity. Keep this under 1% of total capital.',
    difficulty: 'Beginner' },

  { id: 2, title: 'Always Use Stop Loss \u2014 No Exceptions', category: 'Risk Management', icon: '\U0001f6d1',
    content: 'A stop loss is your insurance policy. Without it, one bad trade can wipe out months of profits. Set it before entering the trade, not after. Mental stop losses don\u2019t work \u2014 use actual orders.',
    proTip: 'Place stop loss below the recent swing low (for long) or above swing high (for short). Avoid round numbers \u2014 institutions hunt those levels.',
    difficulty: 'Beginner' },

  { id: 3, title: 'Risk-Reward Ratio: Minimum 1:2', category: 'Risk Management', icon: '\u2696\ufe0f',
    content: 'If you risk \u20b91,000, your target should be at least \u20b92,000. With a 1:2 R:R ratio, you only need to win 34% of your time to be profitable. This is the math edge that separates pros from amateurs.',
    proTip: 'Before every trade, calculate: (Target - Entry) \u00f7 (Entry - Stop Loss). If it\u2019s less than 2, skip the trade.',
    difficulty: 'Beginner' },

  { id: 4, title: 'Position Sizing \u2014 The Most Important Skill', category: 'Risk Management', icon: '\U0001f4d0',
    content: 'Position size = (Capital \u00d7 Risk%) \u00f7 (Entry Price - Stop Loss). This ensures you risk the same percentage on every trade regardless of the stock price or stop distance.',
    proTip: 'Never adjust your stop loss to fit your position size. Always calculate position size based on your stop loss. The stop loss comes first.',
    difficulty: 'Beginner' },

  { id: 5, title: 'The 5% Rule \u2014 Maximum Weekly Drawdown', category: 'Risk Management', icon: '\u26a0\ufe0f',
    content: 'If you lose 5% of your capital in a week, stop trading for the rest of the week. This prevents emotional revenge trading that destroys accounts. Come back next week with a fresh mind and fresh analysis.',
    proTip: 'Track your daily P&L. If you hit -3% in a day, stop. If you hit -5% in a week, stop. These are hard rules, not suggestions.',
    difficulty: 'Beginner' },

  { id: 6, title: 'Never Average Down on Losing Trades', category: 'Risk Management', icon: '\U0001f4c9',
    content: 'Adding to a losing position is the fastest way to blow up an account. The market is telling you that your analysis is wrong. Listen to it. Average up on winners, never down on losers.',
    proTip: 'If you want to add to a position, only do so when it\u2019s already in profit and pulling back to support. This is called pyramiding.',
    difficulty: 'Beginner' },

  { id: 7, title: 'Diversify Across Sectors \u2014 Don\u2019t Put All Eggs in One Basket', category: 'Risk Management', icon: '\U0001f4e6',
    content: 'Don\u2019t have more than 20% of your portfolio in a single stock or sector. If that sector crashes, your portfolio survives. Spread across 5-8 sectors.',
    proTip: 'Track sector correlations. If IT and Pharma both drop when USD/INR rises, they\u2019re correlated. Pick sectors that move independently.',
    difficulty: 'Intermediate' },

  { id: 8, title: 'Use Trailing Stop Loss to Protect Profits', category: 'Risk Management', icon: '\U0001f51b',
    content: 'When a trade moves in your favor, move your stop loss to breakeven, then trail it behind the price. This locks in profits while letting winners run. Use ATR-based trailing stops.',
    proTip: 'Trail stop at 2x ATR below the highest high since entry. This gives the trade room to breathe while protecting profits.',
    difficulty: 'Intermediate' },

  { id: 9, title: 'The 3-Strike Rule \u2014 When to Walk Away', category: 'Risk Management', icon: '\u2620\ufe0f',
    content: 'If you lose 3 trades in a row, stop trading for the day. Three consecutive losses means either your analysis is off or the market conditions don\u2019t match your strategy. Come back tomorrow.',
    proTip: 'Keep a strike counter visible on your trading screen. When it hits 3, close your terminal. Go for a walk.',
    difficulty: 'Beginner' },

  { id: 10, title: 'Risk Per Trade vs Risk Per Portfolio', category: 'Risk Management', icon: '\U0001f4b0',
    content: 'Even if each trade risks only 1%, having 10 open trades means you could lose 10% at once. Your total portfolio risk across all open positions should never exceed 6%.',
    proTip: 'Maintain a correlation matrix. If all your stocks are in the same sector, your effective risk is much higher than 1% per trade.',
    difficulty: 'Advanced' },

  { id: 11, title: 'The Weekend Rule \u2014 Review Before Monday', category: 'Risk Management', icon: '\U0001f4c5',
    content: 'Every weekend, review your past week\u2019s trades. What worked? What didn\u2019t? Why? Without weekly review, you repeat the same mistakes. Plan your trades for the coming week on Sunday evening.',
    proTip: 'Create a weekly checklist: market trend, key levels to watch, events/earnings, max trades planned, risk budget.',
    difficulty: 'Beginner' },

  { id: 12, title: 'Limit Leverage \u2014 Especially as a Beginner', category: 'Risk Management', icon: '\u267f\ufe0f',
    content: 'Leverage amplifies both gains and losses. A 10x leverage means a 10% move against you wipes you out. Beginners should use no more than 2x leverage. Experienced traders rarely exceed 5x.',
    proTip: 'If you\u2019re using F&O, risk only the premium you can afford to lose entirely. Never use margin to hold losing F&O positions.',
    difficulty: 'Beginner' },

  { id: 13, title: 'The 80-20 Rule of Risk', category: 'Risk Management', icon: '\U0001f4ca',
    content: '80% of your drawdowns will come from 20% of your trades. Identify your worst setups and eliminate them. Focus only on the 20% of setups that produce 80% of your profits.',
    proTip: 'After 100 trades, sort your trades by setup type. Kill the bottom 3 setups. Double down on the top 3.',
    difficulty: 'Intermediate' },

  { id: 14, title: 'Use Options for Defined Risk', category: 'Risk Management', icon: '\U0001f4cb',
    content: 'Buying options gives you defined risk \u2014 the most you can lose is the premium. Use call/put options instead of futures when you want to limit downside while keeping unlimited upside.',
    proTip: 'Buy slightly OTM options 2-4 weeks before expiry. Avoid weekly options as a beginner \u2019 theta decay destroys them.',
    difficulty: 'Advanced' },

  { id: 15, title: 'Set a Daily Profit Target and Stop', category: 'Risk Management', icon: '\U0001f3af',
    content: 'Set a daily profit target (e.g., 2% of capital) and a daily stop loss (e.g., 3% of capital). When you hit either, stop trading for the day. This prevents greed from giving back profits.',
    proTip: 'When you hit your profit target, withdraw 50% of gains to your bank account. This keeps you grounded and builds your capital reserve.',
    difficulty: 'Beginner' },

  // ═══════════════════════════════════════════
  // TECHNICAL ANALYSIS (16-35)
  // ═══════════════════════════════════════════
  { id: 16, title: 'Trade with the Trend \u2014 "The Trend is Your Friend"', category: 'Technical Analysis', icon: '\U0001f4c8',
    content: 'In an uptrend, look for buying opportunities on pullbacks. In a downtrend, look for selling opportunities on rallies. Fighting the trend is the #1 reason beginners lose money. Use 200 EMA to determine the trend.',
    proTip: 'On daily charts, if price is above 200 EMA = uptrend. Only take long trades. Below 200 EMA = downtrend. Only take short trades.',
    difficulty: 'Beginner' },

  { id: 17, title: 'Volume Confirms Everything', category: 'Technical Analysis', icon: '\U0001f4ca',
    content: 'A breakout without volume is likely a false breakout. Volume is the fuel behind price moves. Rising price + rising volume = strong trend. Rising price + falling volume = weakening trend (divergence).',
    proTip: 'On breakout days, volume should be at least 1.5x the 20-day average volume. Low-volume breakouts fail 70% of the time.',
    difficulty: 'Intermediate' },

  { id: 18, title: 'Support and Resistance \u2014 The Market\u2019s Memory', category: 'Technical Analysis', icon: '\U0001f504',
    content: 'Support and resistance levels are where price has reversed before. The more times a level is tested, the stronger it becomes. When a level finally breaks, it often flips \u2014 old support becomes new resistance.',
    proTip: 'Mark S/R levels on higher timeframes (daily/weekly). These are more reliable than intraday levels. Use horizontal lines, not zones.',
    difficulty: 'Beginner' },

  { id: 19, title: 'Moving Averages \u2014 Dynamic Support & Resistance', category: 'Technical Analysis', icon: '\U0001f4c9',
    content: '20 EMA = short-term trend. 50 EMA = medium-term trend. 200 EMA = long-term trend. Price above all three = strong uptrend. The 200 EMA is watched by institutions worldwide.',
    proTip: 'When 20 EMA crosses above 50 EMA = bullish signal (Golden Cross when 50 crosses above 200). Use pullbacks to 20 EMA as entry points in trends.',
    difficulty: 'Intermediate' },

  { id: 20, title: 'RSI Divergence \u2014 The Hidden Reversal Signal', category: 'Technical Analysis', icon: '\U0001f50d',
    content: 'When price makes a new high but RSI makes a lower high = bearish divergence (potential top). When price makes a new low but RSI makes a higher low = bullish divergence (potential bottom).',
    proTip: 'RSI divergence on the daily chart is very reliable. Combine with support/resistance for best results. RSI > 70 = overbought, RSI < 30 = oversold.',
    difficulty: 'Intermediate' },

  { id: 21, title: 'MACD \u2014 Trend Following + Momentum', category: 'Technical Analysis', icon: '\U0001f4e1',
    content: 'MACD line crossing above signal line = bullish. Crossing below = bearish. MACD histogram growing = momentum increasing. Shrinking = momentum decreasing. Zero line crossover = trend change.',
    proTip: 'Best used in trending markets. In sideways markets, MACD gives false signals. Combine with price action for confirmation.',
    difficulty: 'Intermediate' },

  { id: 22, title: 'Fibonacci Retracement \u2014 The Golden Ratio in Markets', category: 'Technical Analysis', icon: '\U0001f522',
    content: 'Key Fib levels: 23.6%, 38.2%, 50%, 61.8%, 78.6%. Price often retraces to these levels before continuing the trend. The 61.8% (golden ratio) is the most important level.',
    proTip: 'Draw Fib from swing low to swing high (uptrend). Look for entries at 38.2%, 50%, or 61.8% retracement. Place stop loss below 78.6%.',
    difficulty: 'Intermediate' },

  { id: 23, title: 'Fibonacci Extension \u2014 Price Targets', category: 'Technical Analysis', icon: '\u27a1\ufe0f',
    content: 'Fibonacci extensions (1.272%, 1.618%, 2.618%) are used to set profit targets. After a breakout, price often extends to these levels. The 1.618 extension is the most common target.',
    proTip: 'After a triangle breakout, measure the triangle\u2019s height. Project 1.618x from the breakout point. That\u2019s your target.',
    difficulty: 'Advanced' },

  { id: 24, title: 'Bollinger Bands \u2014 Volatility-Based Trading', category: 'Technical Analysis', icon: '\U001f4cf',
    content: 'Price touching upper band = overbought zone. Touching lower band = oversold zone. Bands squeeze = big move coming (volatility expansion). Bands expand = trend is strong.',
    proTip: 'In trends, price walks along the upper band (uptrend) or lower band (downtrend). Don\u2019t use bands alone \u2014 combine with RSI or MACD.',
    difficulty: 'Intermediate' },

  { id: 25, title: 'Candlestick Patterns \u2014 Read the Battle', category: 'Technical Analysis', icon: '\U0001f56f\ufe0f',
    content: 'Each candlestick tells a story of the battle between buyers and sellers. Long wicks = rejection. Large bodies = conviction. Doji = indecision. Learn the 15 major patterns and their psychology.',
    proTip: 'Single candlestick patterns (hammer, shooting star) need confirmation. Multi-candle patterns (engulfing, morning star) are more reliable.',
    difficulty: 'Beginner' },

  { id: 26, title: 'Ichimoku Cloud \u2014 The All-in-One Indicator', category: 'Technical Analysis', icon: '\u2601\ufe0f',
    content: 'Ichimoku shows trend direction, support/resistance, momentum, and trading signals all in one. Price above cloud = bullish. Below cloud = bearish. Cloud color changes = potential reversal.',
    proTip: 'Use Ichimoku on daily/weekly charts. The TK cross (Tenkan crossing Kijun) is the most important signal. Wait for price to confirm.',
    difficulty: 'Advanced' },

  { id: 27, title: 'ADX \u2014 Measuring Trend Strength', category: 'Technical Analysis', icon: '\U0001f4c6',
    content: 'ADX (Average Directional Index) measures trend strength, not direction. ADX > 25 = strong trend. ADX < 20 = weak/no trend. Rising ADX = trend strengthening. Falling ADX = trend weakening.',
    proTip: 'Don\u2019t trade breakouts when ADX is below 20. Wait for ADX to rise above 25 before trading trend-following strategies.',
    difficulty: 'Intermediate' },

  { id: 28, title: 'Stochastic Oscillator \u2014 Overbought/Oversold Timing', category: 'Technical Analysis', icon: '\U0001f9ea',
    content: 'Stochastic (14,3,3) shows where the close is relative to the high-low range. Above 80 = overbought. Below 20 = oversold. %K crossing above %D = buy signal.',
    proTip: 'In strong trends, stochastic can stay overbought/oversold for weeks. Use it primarily at support/resistance levels, not as a standalone signal.',
    difficulty: 'Intermediate' },

  { id: 29, title: 'OBV \u2014 On-Balance Volume for Divergence', category: 'Technical Analysis', icon: '\U0001f4c5',
    content: 'OBV adds volume on up days and subtracts volume on down days. Rising OBV = accumulation. Falling OBV = distribution. OBV divergence from price = early reversal warning.',
    proTip: 'If price is making new highs but OBF is making lower highs, distribution is happening. Smart money is selling to retail.',
    difficulty: 'Intermediate' },

  { id: 30, title: 'ATR \u2014 Average True Range for Stop Loss', category: 'Technical Analysis', icon: '\U0001f4d0',
    content: 'ATR measures volatility. Set stop losses at 2x ATR from entry (not fixed percentages). In volatile markets, stops are wider. In quiet markets, tighter. This adapts to market conditions.',
    proTip: 'Use 14-period ATR. For a long entry, place stop at Entry - (2 \u00d7 ATR). For targets, use Entry + (3 \u00d7 ATR) for 1:1.5 R:R.',
    difficulty: 'Intermediate' },

  { id: 31, title: 'Pivot Points \u2014 Institutional Levels', category: 'Technical Analysis', icon: '\U0001f4cd',
    content: 'Pivot Points = (High + Low + Close) \u00f7 3. Support and resistance levels (S1, S2, R1, R2) are calculated from this. Institutions use these levels. Price often reacts at them.',
    proTip: 'Buy at S1/S2 in uptrends. Sell at R1/R2 in downtrends. Use pivot points as a framework, not a standalone strategy.',
    difficulty: 'Intermediate' },

  { id: 32, title: 'Volume Profile \u2014 Where the Real Volume Is', category: 'Technical Analysis', icon: '\U0001f4c1',
    content: 'Volume profile shows volume traded at each price level (not over time). High Volume Nodes (HVN) = strong support/resistance. Low Volume Nodes (LVN) = price moves through quickly.',
    proTip: 'The Point of Control (POC) is the price with the highest volume. Price often returns to POC. Use it as a magnet for mean-reversion trades.',
    difficulty: 'Advanced' },

  { id: 33, title: 'Wyckoff Method \u2019s Accumulation/Distribution', category: 'Technical Analysis', icon: '\U0001f3e6',
    content: 'Wyckoff identified how institutions accumulate (buy) and distribute (sell) shares. Accumulation = range-bound with higher lows. Distribution = range-bound with lower highs.',
    proTip: 'Look for "spring" (false breakdown below support) in accumulation. It\u2019s the institutional shakeout before the real move up.',
    difficulty: 'Advanced' },

  { id: 34, title: 'Multiple Timeframe Analysis \u2019s Hierarchy', category: 'Technical Analysis', icon: '\u23f0',
    content: 'Use 3 timeframes: higher (trend direction), medium (setup identification), lower (entry timing). E.g., weekly for trend, daily for setup, 15-min for entry.',
    proTip: 'If weekly and daily both show uptrend, only take long signals on the 15-minute chart. Never trade against the higher timeframe trend.',
    difficulty: 'Intermediate' },

  { id: 35, title: 'Dow Theory \u2019s Six Principles', category: 'Technical Analysis', icon: '\U0001f4d6',
    content: 'Markets move in three trends (primary, secondary, secondary). Primary trends have three phases (accumulation, public participation, distribution). Volume must confirm the trend. Trends persist until clear reversal.',
    proTip: 'The most important principle: averages must confirm each other. If Nifty is making new highs but Bank Nifty isn\u2019t confirming, the rally is weak.',
    difficulty: 'Advanced' },

  // ═══════════════════════════════════════════
  // STRATEGIES (36-55)
  // ═══════════════════════════════════════════
  { id: 36, title: 'The Moving Average Crossover Strategy', category: 'Strategy', icon: '\u2702\ufe0f',
    content: 'When a fast MA (like 9 EMA) crosses above a slow MA (like 21 EMA) = buy signal. Crosses below = sell signal. Simple but effective in trending markets.',
    proTip: 'Use 9/21 EMA crossover on 5-minute charts for intraday. Use 50/200 EMA crossover (Golden Cross/Death Cross) on daily charts for swing trades.',
    difficulty: 'Beginner' },

  { id: 37, title: 'Breakout Trading \u2014 Catch the Big Moves', category: 'Strategy', icon: '\U0001f4a5',
    content: 'When price breaks above resistance or below support with volume, a big move often follows. The key is distinguishing real breakouts from false ones. Wait for confirmation.',
    proTip: 'Real breakout: closes above resistance with 1.5x+ average volume. False breakout: wicks above but closes below. Wait for the candle close.',
    difficulty: 'Intermediate' },

  { id: 38, title: 'Swing Trading \u2014 The Best Style for Beginners', category: 'Strategy', icon: '\U0001f3c3',
    content: 'Hold positions for 2-10 days. Use daily charts. Less stressful than intraday. More profitable than long-term for active traders. Focus on stocks in clear trends.',
    proTip: 'Enter on pullbacks to support in uptrends. Exit at resistance or when the trend breaks. Use 20 EMA as your trend filter.',
    difficulty: 'Beginner' },

  { id: 39, title: 'The ABCD Pattern \u2014 Harmonic Trading Basics', category: 'Strategy', icon: '\U0001f537',
    content: 'A=start, B=first pullback, C=partial retracement, D=completion. The C point should retrace 38.2%-78.6% of AB. D point extends to 1.272%-1.618% of BC. Trade reversals at D.',
    proTip: 'Use Fibonacci tools to measure the B-C leg. Enter at the 1.272 extension. Stop loss beyond the 1.618 extension.',
    difficulty: 'Advanced' },

  { id: 40, title: 'Elliott Wave \u2014 Market Psychology in 5 Waves', category: 'Strategy', icon: '\U0001f30a',
    content: 'Markets move in 5 waves in the direction of the trend (1-2-3-4-5), followed by a 3-wave correction (A-B-C). Wave 3 is usually the longest and most profitable.',
    proTip: 'Don\u2019t try to label every wave in real-time. Use Elliott Wave to understand market structure, not for precise entries. Combine with Fibonacci.',
    difficulty: 'Advanced' },

  { id: 41, title: 'Supply and Demand Zone Trading', category: 'Strategy', icon: '\u26fd\ufe0f',
    content: 'Supply zones = areas where sellers overwhelmed buyers (price dropped sharply). Demand zones = areas where buyers overwhelmed sellers (price rallied sharply). Trade reversals at these zones.',
    proTip: 'Mark zones on higher timeframes. A demand zone on the weekly chart is far more powerful than one on the 5-minute chart.',
    difficulty: 'Intermediate' },

  { id: 42, title: 'Price Action Trading \u2014 Pure Charts, No Indicators', category: 'Strategy', icon: '\U0001f4c8',
    content: 'Use only price, candles, support/resistance, and trendlines. No indicators. Read the story the price is telling. Pin bars, engulfing candles, inside bars are your signals.',
    proTip: 'Start with just 200 EMA (for trend) and horizontal S/R levels. Add nothing else for 6 months. Pure price action builds the best intuition.',
    difficulty: 'Advanced' },

  { id: 43, title: 'Mean Reversion \u2014 Buy Low, Sell High in Ranges', category: 'Strategy', icon: '\u2194\ufe0f',
    content: 'In sideways/range-bound markets, price tends to revert to the mean. Buy near the bottom of the range, sell near the top. Use Bollinger Bands or RSI to identify extremes.',
    proTip: 'Mean reversion works great in indices like Nifty when it\u2019s in a range. It FAILS in trending markets. Always check the trend first.',
    difficulty: 'Intermediate' },

  { id: 44, title: 'Momentum Trading \u2014 Follow the Strongest Stocks', category: 'Strategy', icon: '\U0001f680',
    content: 'Buy the strongest stocks in the strongest sectors. Sell the weakest. Momentum stocks outperform over 1-6 months. Use relative strength ranking to find them.',
    proTip: 'Rank Nifty 50 stocks by 3-month returns. Go long the top 5, short the bottom 5. Rebalance monthly. This is a classic momentum strategy.',
    difficulty: 'Intermediate' },

  { id: 45, title: 'Pairs Trading \u2014 Market Neutral Profits', category: 'Strategy', icon: '\u267e\ufe0f',
    content: 'Find two correlated stocks (like HDFC Bank and ICICI Bank). When one outperforms the other, go long the underperformer and short the short the outperformer. Profit when they converge.',
    proTip: 'Use cointegration tests, not just correlation. The spread must be mean-reverting. This is a quant strategy used by hedge funds.',
    difficulty: 'Advanced' },

  { id: 46, title: 'Gap and Go Strategy \u2014 Trade the Morning Gap', category: 'Strategy', icon: '\u2601\ufe0f',
    content: 'When a stock gaps up at open (on news/earnings), it often continues in the direction of the gap. Buy the gap up, short the gap down. Requires quick execution.',
    proTip: 'Only trade gaps > 2% with above-average pre-market volume. Enter in the first 5 minutes. Stop loss at the gap midpoint.',
    difficulty: 'Advanced' },

  { id: 47, title: 'VWAP Reversion \u2014 Mean Reversion to VWAP', category: 'Strategy', icon: '\U0001f3db\ufe0f',
    content: 'Price tends to revert to VWAP. When price is far above VWAP, look for short opportunities. Far below VWAP, look for long opportunities. Works best in range-bound days.',
    proTip: 'Use VWAP + standard deviation bands. Short when price touches upper band in a range. Long when it touches lower band.',
    difficulty: 'Intermediate' },

  { id: 48, title: 'Opening Range Breakout (ORB)', category: 'Strategy', icon: '\u23f0',
    content: 'Mark the high and low of the first 15 minutes. When price breaks above the high with volume = go long. Breaks below the low = go short. Popular intraday strategy.',
    proTip: 'Wait for a confirmed close beyond the range, not just a wick. Use 5-minute candles. Stop loss at the opposite end of the range.',
    difficulty: 'Intermediate' },

  { id: 49, title: 'Scalping \u2014 Quick Profits, Tight Stops', category: 'Strategy', icon: '\u2694\ufe0f',
    content: 'Enter and exit within seconds to minutes. Target 0.1-0.5% per trade. Requires very low brokerage, excellent execution, and intense focus. Only for experienced traders.',
    proTip: 'Scalping is a full-time job. You need direct market access, Level 2 data, and < \u20b920/trade brokerage. Most retail scalpers lose money. Start with swing trading.',
    difficulty: 'Advanced' },

  { id: 50, title: 'Position Trading \u2014 The Long Game', category: 'Strategy', icon: '\U0001f3f3\ufe0f',
    content: 'Hold positions for weeks to months. Use weekly charts. Based on fundamentals + technicals. Less time-consuming than intraday. Better for people with full-time jobs.',
    proTip: 'Position trading requires patience. Set your targets and stops, then walk away. Don\u2019t check the charts every hour.',
    difficulty: 'Beginner' },

  { id: 51, title: 'Dividend investing \u2014 Get Paid to Hold', category: 'Strategy', icon: '\U0001f4b5',
    content: 'Buy stocks that pay consistent dividends. Reinvest the dividends. Over time, compound growth from dividends + capital appreciation creates enormous wealth.',
    proTip: 'Look for dividend yield > 2%, payout ratio < 60%, and 10+ years of consistent dividend payments. DIVIDEND STOCKS ARE NOT GET-RICH-QUICK. They\u2019t get-rich-slow.',
    difficulty: 'Beginner' },

  { id: 52, title: 'Index Fund Investing \u2014 The Lazy (But Smart) Way', category: 'Strategy', icon: '\U0001f4b9',
    content: 'Instead of picking stocks, buy the entire market through index funds (Nifty 50, Sensex). Historically, 90% of actively managed funds underperform index funds over 10+ years.',
    proTip: 'Invest a fixed amount every month (SIP) in a Nifty 50 index fund. Don\u2019t try to time the market. Just keep investing. 15% annual returns compounded over 20 years = life-changing money.',
    difficulty: 'Beginner' },

  { id: 53, title: 'Pyramiding \u2014 Adding to Winners', category: 'Strategy', icon: '\u25b2',
    content: 'Add to winning positions as the trend continues. Each addition should be smaller than the previous. This maximizes profits in strong trends while keeping average cost reasonable.',
    proTip: 'Add 50% of original position at first target, then 25% at second target. Trail stop loss to breakeven after first addition.',
    difficulty: 'Advanced' },

  { id: 54, title: 'Pyramid Sizing \u2014 Bigger at Better Prices', category: 'Strategy', icon: '\U0001f53c',
    content: 'If you want to buy a stock at \u20b9100 but it drops to \u20b995, buy more at \u20b995 (not less). Lower prices = better value = bigger position. But only if your thesis is unchanged.',
    proTip: 'Use a scale-in approach: buy 40% at \u20b9100, 35% at \u20b995, 25% at \u20b990. Average cost = \u20b996. This is smarter than going all-in at one price.',
    difficulty: 'Intermediate' },

  { id: 55, title: 'Options Straddle \u2014 Profit from Big Moves', category: 'Strategy', icon: '\u27a1\ufe0f\u2b05\ufe0f',
    content: 'Buy both a call and a put at the same strike and expiry. Profit when the stock moves significantly in either direction. Works great before earnings or major events.',
    proTip: 'Buy straddles 2-3 days before the event. Sell immediately after the event (IV crush destroys straddle value). Don\u2019t hold through the event.',
    difficulty: 'Advanced' },

  // ═══════════════════════════════════════════
  // INTRADAY STRATEGIES (56-70)
  // ═══════════════════════════════════════════
  { id: 56, title: 'The 3:15 PM Rule \u2014 Avoid the Chaos', category: 'Intraday', icon: '\U0001f550',
    content: 'The last 45 minutes before market close (3:15 PM) is when institutional rebalancing happens. Volatility spikes, spreads widen, and retail traders get stopped out.',
    proTip: 'If you have an open intraday position at 3:00 PM, decide: close it or convert to delivery. Don\u2019t hold overnight without a plan.',
    difficulty: 'Beginner' },

  { id: 57, title: 'Trade the First Hour, Avoid the Last Hour', category: 'Intraday', icon: '\u23f0',
    content: 'The first hour (9:15-10:15 AM) has the most volume and cleanest moves. The last hour is noisy and manipulated. Most intraday profits are made in the first 2 hours.',
    proTip: 'Plan your trades before market open. Execute in the first hour. After 11 AM, reduce position size or switch to scalping only.',
    difficulty: 'Intermediate' },

  { id: 58, title: 'Only Trade A-Grade Stocks for Intraday', category: 'Intraday', icon: '\u2b50',
    content: 'Only trade the top 20 most liquid stocks (Reliance, TCS, HDFC Bank, Infosys, etc.). These have tight spreads, deep order books, and clean technical levels.',
    proTip: 'Avoid low-volume penny stocks for intraday. You\u2019ll get slipped on every entry/exit. Liquidity > everything else for intraday.',
    difficulty: 'Beginner' },

  { id: 59, title: 'The VWAP Bounce Strategy', category: 'Intraday', icon: '\U0001f31f',
    content: 'In an uptrend, when price pulls back to VWAP and bounces, go long. In a downtrend, when price rallies to VWAP and reverses, go short. VWAP is the intraday fair value.',
    proTip: 'Wait for a clear reversal candle at VMAC (not just a touch). A hammer or engulfing candle at VWAP is your confirmation.',
    difficulty: 'Intermediate' },

  { id: 60, title: 'Pre-Market Analysis \u2014 Know Before You Go', category: 'Intraday', icon: '\U0001f305',
    content: 'Before market opens, check: overnight SGX Nifty / US markets, pre-market volume, key news, and your watchlist levels. Enter the market with a plan, not reactively.',
    proTip: 'Spend 30 minutes before open: mark yesterday\u2019s high/low/close, identify key levels, check global cues. This is more important than any indicator.',
    difficulty: 'Beginner' },

  { id: 61, title: 'The 9:15-9:30 AM Trap \u2014 Wait for the Dust to Settle', category: 'Intraday', icon: '\U0001f4a9',
    content: 'The first 15 minutes after opening is full of fake moves, stop hunting, and emotional trading. Wait until 9:30 AM. The real direction usually emerges by then.',
    proTip: 'If you miss the first 15 minutes, don\u2019t chase. Wait for 9:30-10:00 AM setups. The market gives new opportunities every 15 minutes.',
    difficulty: 'Beginner' },

  { id: 62, title: 'Scalping with Level 2 Data', category: 'Intraday', icon: '\U0001f4f1',
    content: 'Level 2 shows the order book \u2014 who\u2019s buying, who\u2019s selling, and at what price. Large institutional orders sitting at a level = strong support/resistance.',
    proTip: 'If you see a large buy wall at \u20b91000 (10,000 shares), price will likely bounce off that level. Use it as your stop loss level.',
    difficulty: 'Advanced' },

  { id: 63, title: 'News-Based Intraday Trading', category: 'Intraday', icon: '\U0001f4f0',
    content: 'Trade the news, not the rumors. RBI policy, earnings, government announcements \u2014 these create huge intraday moves. Be ready before the news hits.',
    proTip: 'Don\u2019t trade DURING the news (too volatile). Trade the AFTERMATH. Wait 5 minutes after the news, then trade the direction of the move.',
    difficulty: 'Advanced' },

  { id: 64, title: 'Intraday Gap Trading', category: 'Intraday', icon: '\U0001f53a',
    content: 'If a stock gaps up > 2%, decide immediately: is it a continuation gap or exhaustion gap? Continuation gaps (on strong news) keep going. Exhaustion gaps reverse.',
    proTip: 'Gap up + high volume = continuation. Gap up + low volume = likely to fill. Gap up into resistance = likely to reverse.',
    difficulty: 'Intermediate' },

  { id: 65, title: 'The 15-Minute Trend Following Strategy', category: 'Intraday', icon: '\U0001f4c6',
    content: 'Use 21 EMA on the 15-minute chart. When price is above 21 EMA, only take long trades. Below 21 EMA, only take short trades. Simple, effective, mechanical.',
    proTip: 'Add RSI filter: only go long when RSI > 50 and price > 21 EMA. This eliminates 50% of false signals.',
    difficulty: 'Intermediate' },

  { id: 66, title: 'Expiry Day Trading \u2014 High Risk, High Reward', category: 'Intraday', icon: '\u26a0\ufe0f',
    content: 'F&O expiry days have massive volatility. OTM options can go 10x, but most expire worthless. Only trade expiry if you have 6+ months of options experience.',
    proTip: 'Sell options on expiry (collect theta), don\u2019t buy them. Or use strangles/straddles where risk is defined. Never hold naked short options.',
    difficulty: 'Advanced' },

  { id: 67, title: 'BTST (Buy Today Sell Tomorrow) Strategy', category: 'Intraday', icon: '\U0001f319',
    content: 'Identify strong stocks at the end of the day (closing near the high on high volume). Buy near close, sell the next morning at gap-up or at resistance.',
    proTip: 'Only BTST stocks that closed in the top 10% of their daily range. Avoid BTST on weak market days.',
    difficulty: 'Intermediate' },

  { id: 68, title: 'The 3-Candle Intraday Reversal', category: 'Intraday', icon: '\U0001f56f\ufe0f',
    content: 'Three consecutive bearish candles with decreasing volume followed by a bullish engulfing = buy signal. Three consecutive bullish candles with decreasing volume followed by bearish engulfing = sell signal.',
    proTip: 'Add filter: the engulfing candle should have 2x the volume of the previous three candles combined.',
    difficulty: 'Intermediate' },

  { id: 69, title: 'Intraday Support and Resistance Scalping', category: 'Intraday', icon: '\u2696\ufe0f',
    content: 'Mark yesterday\u2019s high, low, close, and today\u2019s opening. These 4 levels are the most important intraday S/R levels. Price reacts to them every single day.',
    proTip: 'Add pre-market high/low and VWAP to your 4 levels. That gives you 6 key levels. Price will bounce or break at these levels.',
    difficulty: 'Beginner' },

  { id: 70, title: 'Sector Rotation for Intraday', category: 'Intraday', icon: '\U0001f504',
    content: 'Money flows between sectors. If IT is going up, buy the weakest IT stock (it will catch up). If Banks are going down, short the weakest bank (it will fall more).',
    proTip: 'Track sector indices (Bank Nifty, IT Nifty, Pharma Nifty). Trade the sector with the strongest momentum.',
    difficulty: 'Intermediate' },

  // ═══════════════════════════════════════════
  // PSYCHOLOGY (71-85)
  // ═══════════════════════════════════════════
  { id: 71, title: 'FOMO is Your Enemy \u2014 Wait for Setups', category: 'Psychology', icon: '\U0001f631',
    content: 'Fear of Missing Out causes traders to chase stocks that have already moved. By the time you FOMO in, smart money is selling to you. Wait for pullbacks.',
    proTip: 'If a stock has moved 5%+ in a day, skip it. Wait for a pullback to support. The market gives new setups every single day.',
    difficulty: 'Beginner' },

  { id: 72, title: 'Overtrading \u2014 The Silent Account Killer', category: 'Psychology', icon: '\U0001f480',
    content: 'Taking too many trades, especially in sideways markets, destroys accounts through commissions and emotional fatigue. Quality over quantity.',
    proTip: 'Set a maximum of 3 trades per day. If you hit your daily stop loss, stop trading for the day. Come back tomorrow with a fresh mind.',
    difficulty: 'Beginner' },

  { id: 73, title: 'The 80-20 Rule of Trading', category: 'Psychology', icon: '\U001f9e0',
    content: '80% of your profits will come from 20% of your trades. Most trades will be small wins or small losses. The key is letting winners run and cutting losers quickly.',
    proTip: 'Review your trades monthly. Identify your best setups and focus only on those. Eliminate the setups that consistently lose money.',
    difficulty: 'Intermediate' },

  { id: 74, title: 'Trading Journal \u2014 Your Edge Multiplier', category: 'Psychology', icon: '\U001f4d3',
    content: 'Record every trade: entry reason, exit reason, emotions, screenshots. After 50+ trades, patterns emerge. You\u2019ll discover which setups work for you and which don\u2019t.',
    proTip: 'Rate each trade 1-5 on execution quality (not P&L). A losing trade with 5/5 execution is a good trade. A winning trade with 2/5 execution is a bad trade.',
    difficulty: 'Beginner' },

  { id: 75, title: 'Accept Losses \u2014 They Are Tuition Fees', category: 'Psychology', icon: '\U001f393',
    content: 'Every trader loses. Even the best in the world win only 55-60% of the time. A loss is not a failure \u2014 it\u2019s the cost of doing business. What matters is that your winners are bigger than your losers.',
    proTip: 'After a loss, write down what you learned. If you didn\u2019t learn anything, you\u2019re doomed to repeat the same mistake.',
    difficulty: 'Beginner' },

  { id: 76, title: 'Don\u2019t Check Your P&L Every 5 Minutes', category: 'Psychology', icon: '\U001f4fa',
    content: 'Obsessively checking your P&L creates emotional stress and leads to premature exits. Set your trade, set your stop, and walk away. Check at the end of the day.',
    proTip: 'Hide your P&L column from your trading platform. Focus on the chart, not the money. The money follows good execution.',
    difficulty: 'Beginner' },

  { id: 77, title: 'The Revenge Trading Trap', category: 'Psychology', icon: '\u2694\ufe0f',
    content: 'After a loss, the urge to "get it back" leads to impulsive, oversized trades. Revenge trading is the #1 account killer. When you lose, reduce size, don\u2019t increase it.',
    proTip: 'After 2 consecutive losses, reduce your position size by 50%. After 3 losses, stop for the day. This is a mechanical rule.',
    difficulty: 'Intermediate' },

  { id: 78, title: 'Confirmation Bias \u2014 See What Is, Not What You Want', category: 'Psychology', icon: '\U001f441\ufe0f',
    content: 'Traders see bullish patterns in stocks they own and bearish patterns in stocks they don\u2019t. This is confirmation bias. Force yourself to argue against your own position.',
    proTip: 'Before entering a trade, write down 3 reasons the trade could fail. If you can\u2019t think of 3, you haven\u2019t analyzed enough.',
    difficulty: 'Intermediate' },

  { id: 79, title: 'The Disposition Effect \u2014 Sell Winners Too Early', category: 'Psychology', icon: '\U001f4b8',
    content: 'Traders sell winners too early (to "lock in profits") and hold losers too long (to "avoid realizing the loss"). This is the disposition effect. It destroys returns.',
    proTip: 'Use trailing stops instead of fixed targets. Let winners run until the trend breaks. Cut losers at your stop loss. No exceptions.',
    difficulty: 'Intermediate' },

  { id: 80, title: 'Patience \u2014 The Trader\u2019s Superpower', category: 'Psychology', icon: '\u23f3',
    content: 'The best traders spend 95% of their time waiting and 5% trading. Patience means waiting for your exact setup, not forcing trades. Boredom is profitable.',
    proTip: 'If you haven\u2019t found a trade by 11 AM, the market doesn\u2019t want to give you money today. Go read a book. Come back tomorrow.',
    difficulty: 'Beginner' },

  { id: 81, title: 'Ego is Expensive in Trading', category: 'Psychology', icon: '\U001f60f',
    content: 'Thinking you\u2019re smarter than the market is the fastest way to lose money. The market is always right. Your job is to follow, not to predict.',
    proTip: 'When a trade goes against you, don\u2019t argue with the market. Exit. You can always re-enter. Pride has no place in trading.',
    difficulty: 'Beginner' },

  { id: 82, title: 'The Gambler\u2019s Fallacy in Trading', category: 'Psychology', icon: '\U001f3b2',
    content: 'After 5 losing trades, thinking "the next one MUST be a winner" is the gambler\u2019s fallacy. Each trade is independent. Past results don\u2019t affect future probabilities.',
    proTip: 'If you\u2019re on a losing streak, reduce size or stop. Don\u2019t increase size to "make it back". The market doesn\u2019t owe you anything.',
    difficulty: 'Intermediate' },

  { id: 83, title: 'Visualization \u2014 See the Trade Before You Take It', category: 'Psychology', icon: '\U001f4ad',
    content: 'Before entering a trade, visualize: the entry, the stop loss, the target, and what happens if it goes wrong. If you can\u2019t visualize the exit, don\u2019t enter.',
    proTip: 'Write your trade plan on paper before entering. Entry price, stop loss, target, position size. If it\u2019s not written, it\u2019s not a plan.',
    difficulty: 'Beginner' },

  { id: 84, title: 'The 10,000 Hours Rule Applies to Trading', category: 'Psychology', icon: '\u23f1\ufe0f',
    content: 'It takes years of consistent practice to become a profitable trader. Most beginners quit in the first year. If you survive the first 2 years, your odds improve dramatically.',
    proTip: 'Paper trade for 6 months before using real money. Then trade with minimum size for 6 more months. Only then increase size.',
    difficulty: 'Beginner' },

  { id: 85, title: 'Detach Money from Emotions', category: 'Psychology', icon: '\U001f4b1',
    content: 'Think in percentages and R:R ratios, not in rupees. "I lost \u20b95000" feels terrible. "I lost 0.5% of my capital on a well-executed trade" is rational.',
    proTip: 'Convert all your thinking to percentages. Position size in %. Risk in %. Target in %. This removes emotion from the equation.',
    difficulty: 'Intermediate' },

  // ═══════════════════════════════════════════
  // ADVANCED STRATEGIES (86-100)
  // ═══════════════════════════════════════════
  { id: 86, title: 'Options Greeks \u2014 Understand What Drives Option Prices', category: 'Advanced', icon: '\U001f4d0',
    content: 'Delta = price sensitivity. Gamma = rate of change of Delta. Theta = time decay. Vega = volatility sensitivity. Understanding Greeks helps you choose the right options strategy.',
    proTip: 'Buy options when you expect big moves (high Gamma). Sell options when you expect low volatility (collect Theta). Never hold ATM options through expiry.',
    difficulty: 'Advanced' },

  { id: 87, title: 'Iron Condor \u2014 Profit from Low Volatility', category: 'Advanced', icon: '\u2708\ufe0f',
    content: 'Sell an OTM put spread and an OTM call spread simultaneously. Profit when the stock stays within a range. Maximum profit = net premium received.',
    proTip: 'Iron condors work best when IV is high (you collect more premium) and you expect the stock to stay range-bound. Close at 50% profit.',
    difficulty: 'Advanced' },

  { id: 88, title: 'Calendar Spread \u2014 Exploit Time Decay Differences', category: 'Advanced', icon: '\U001f4c5',
    content: 'Sell a near-term option and buy a longer-term option at the same strike. Profit from faster time decay of the near-term option. Works best in low-volatility environments.',
    proTip: 'Use calendar strikes at the current stock price (ATM). Close before the short option\u2019s expiry to avoid assignment risk.',
    difficulty: 'Advanced' },

  { id: 89, title: 'Butterfly Spread \u2014 Limited Risk, High Reward', category: 'Advanced', icon: '\U001f41b',
    content: 'Buy 1 ITM call, sell 2 ATM calls, buy 1 OTM call. Maximum profit when stock lands exactly at the middle strike. Limited risk = net debit paid.',
    proTip: 'Butterflies are great for earnings plays when you expect a moderate move. Use 30-45 DTE for best theta decay profile.',
    difficulty: 'Advanced' },

  { id: 90, title: 'Covered Call \u2019s Income Strategy', category: 'Advanced', icon: '\U001f4b3',
    content: 'Own 100 shares of a stock and sell an OTM call against it. Collect premium monthly. This reduces your cost base and generates income. Best for stocks you want to hold long-term.',
    proTip: 'Sell calls at 1-2 standard deviations OTM (delta 0.15-0.30). Collect 1-2% monthly. If assigned, you sold at a profit anyway.',
    difficulty: 'Intermediate' },

  { id: 91, title: 'Protective Put \u2019s Insurance for Your Portfolio', category: 'Advanced', icon: '\U001f6e1\ufe0f',
    content: 'Buy a put option against your stock position. If the stock crashes, the put pays off. This is portfolio insurance. The cost is the put premium.',
    proTip: 'Buy puts 2-3 standard deviations OTM (delta 0.10-0.15). They\u2019re cheap and protect against black swan events.',
    difficulty: 'Intermediate' },

  { id: 92, title: 'Collar Strategy \u2019s Zero-Cost Protection', category: 'Advanced', icon: '\U001f451',
    content: 'Own the stock, buy a protective put, and sell a call to pay for the put. Your downside is protected, and the strategy costs nothing (or even credits).',
    proTip: 'Use collars on stocks you\u2019ve made large gains on. You lock in profits while still participating in some upside.',
    difficulty: 'Advanced' },

  { id: 93, title: 'Quantitative Trading \u2019s Algorithmic Edge', category: 'Advanced', icon: '\U001f4bb',
    content: 'Use algorithms to execute trades based on mathematical models. Removes emotion, increases speed, and can process more data than any human. Requires programming skills.',
    proTip: 'Start with Python + backtrader or zipline. Backtest everything. Paper trade for 3 months. Only then go live with real money.',
    difficulty: 'Advanced' },

  { id: 94, title: 'Statistical Arbitrage \u2019s Mean Reversion', category: 'Advanced', icon: '\U001f4c8',
    content: 'Find pairs of stocks that historically move together. When the spread between them widens abnormally, bet on convergence. This is how hedge funds make money.',
    proTip: 'Use cointegration tests (Engle-Granger) to find valid pairs. Correlation alone is not enough. The spread must be mean-reverting.',
    difficulty: 'Advanced' },

  { id: 95, title: 'Event-Driven Trading \u2019s Earnings Plays', category: 'Advanced', icon: '\U001f389',
    content: 'Trade around earnings, mergers, FDA approvals, and other events. The key is understanding implied vs historical volatility and positioning before the event.',
    proTip: 'Before earnings, compare IV rank to historical levels. If IV is high, sell options (strangles). If IV is low, buy options (straddles).',
    difficulty: 'Advanced' },

  { id: 96, title: 'Global Macro Trading \u2019s Big Picture', category: 'Advanced', icon: '\U001f310',
    content: 'Trade based on global economic trends: interest rates, currency movements, commodity prices, geopolitical events. George Soros and Ray Dalio use this approach.',
    proTip: 'Follow central bank policies (RBI, Fed, ECB). Interest rate decisions drive currency, bond, and equity markets. This is the biggest driver of all markets.',
    difficulty: 'Advanced' },

  { id: 97, title: 'Sentiment Analysis \u2019s Crowd Psychology', category: 'Advanced', icon: '\U001f4ac',
    content: 'Use social media, news sentiment, and options flow to gauge market sentiment. When everyone is greedy, be fearful. When everyone is fearful, be greedy.',
    proTip: 'Track the Put/Call ratio. When it\u2019s extremely low (everyone is bullish), the market is vulnerable to a sell-off. Contrarian indicator.',
    difficulty: 'Advanced' },

  { id: 98, title: 'Intermarket Analysis \u2019s Cross-Asset Signals', category: 'Advanced', icon: '\U001f30d',
    content: 'Stocks, bonds, currencies, and commodities are all connected. Rising bond yields = pressure on stocks. Falling USD = boost for emerging markets. Understand the relationships.',
    proTip: 'Watch the US 10-year yield. When it rises above 4.5%, Indian equities usually face headwinds. When it falls, equities rally.',
    difficulty: 'Advanced' },

  { id: 99, title: 'Position Sizing \u2019s Kelly Criterion', category: 'Advanced', icon: '\U001f3af',
    content: 'Kelly Criterion = (Win Probability \u00d7 Average Win - Loss Probability \u00d7 Average Loss) / Average Win. This gives the optimal position size for maximum long-term growth.',
    proTip: 'Use "Half-Kelly" (half the Kelly size) for safety. Full Kelly is too aggressive and leads to large drawdowns. Half-Kelly gives 75% of the growth with much less risk.',
    difficulty: 'Advanced' },

  { id: 100, title: 'The Complete Trader \u2019s Checklist Before Every Trade', category: 'Advanced', icon: '\u2705',
    content: 'Before every trade, answer: 1) What is the trend? 2) Where is my entry? 3) Where is my stop loss? 4) Where is my target? 5) What is the R:R ratio? 6) Is this within my risk limits? 7) Am I emotionally calm? If any answer is "no" or "I don\u2019t know", don\u2019t trade.',
    proTip: 'Print this checklist and keep it next to your screen. Literally check every box before clicking "Buy" or "Sell". This one habit will save you lakhs.',
    difficulty: 'Beginner' },
]
