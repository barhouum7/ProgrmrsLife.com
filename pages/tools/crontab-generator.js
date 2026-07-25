import React, { useState, useCallback, useMemo } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';
import CodeEditor from '../../components/tools/CodeEditor';

export default function CrontabGenerator() {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [day, setDay] = useState('*');
  const [month, setMonth] = useState('*');
  const [weekday, setWeekday] = useState('*');
  const [command, setCommand] = useState('/path/to/script.sh');

  const PRESETS = [
    { label: 'Every Minute', cron: '* * * * *' },
    { label: 'Every 5 Minutes', cron: '*/5 * * * *' },
    { label: 'Every 15 Minutes', cron: '*/15 * * * *' },
    { label: 'Every Hour', cron: '0 * * * *' },
    { label: 'Every 6 Hours', cron: '0 */6 * * *' },
    { label: 'Daily at Midnight', cron: '0 0 * * *' },
    { label: 'Daily at 9 AM', cron: '0 9 * * *' },
    { label: 'Weekly (Sunday)', cron: '0 0 * * 0' },
    { label: 'Monthly (1st)', cron: '0 0 1 * *' },
    { label: 'Yearly (Jan 1)', cron: '0 0 1 1 *' },
    { label: 'Weekdays at 9 AM', cron: '0 9 * * 1-5' },
    { label: 'Every 30 Sec (via 2 jobs)', cron: '* * * * *' },
  ];

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const cronExpression = useMemo(() => 
    `${minute} ${hour} ${day} ${month} ${weekday}`,
    [minute, hour, day, month, weekday]
  );

  const humanReadable = useMemo(() => {
    try {
      return describeCron(minute, hour, day, month, weekday);
    } catch {
      return 'Invalid expression';
    }
  }, [minute, hour, day, month, weekday]);

  const applyPreset = (cron) => {
    const parts = cron.split(' ');
    setMinute(parts[0]);
    setHour(parts[1]);
    setDay(parts[2]);
    setMonth(parts[3]);
    setWeekday(parts[4]);
  };

  const fullLine = `${cronExpression} ${command}`;

  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullLine);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Crontab Generator",
    "description": "Free visual crontab expression generator with human-readable descriptions and common presets.",
    "url": "https://www.progrmrslife.com/tools/crontab-generator",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  return (
    <ToolLayout toolSlug="crontab-generator" schemaMarkup={schemaMarkup}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Crontab Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Build cron expressions visually. See human-readable descriptions and copy the full crontab line.
          </p>
        </div>

        {/* Output Preview */}
        <div className="tool-glass p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Cron Expression
            </span>
            <button onClick={handleCopy} className="tool-btn tool-btn-secondary text-xs py-0.5 px-2" type="button">
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
          </div>
          <code className="text-2xl font-mono font-bold text-gray-900 dark:text-white block mb-2">
            {cronExpression}
          </code>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            📅 {humanReadable}
          </p>
        </div>

        {/* Cron Fields */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: 'Minute', value: minute, setter: setMinute, range: '0-59' },
            { label: 'Hour', value: hour, setter: setHour, range: '0-23' },
            { label: 'Day', value: day, setter: setDay, range: '1-31' },
            { label: 'Month', value: month, setter: setMonth, range: '1-12' },
            { label: 'Weekday', value: weekday, setter: setWeekday, range: '0-6' },
          ].map((field) => (
            <div key={field.label} className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {field.label}
              </label>
              <input
                type="text"
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                className="tool-editor px-2 py-2 text-center text-lg font-mono"
                style={{ minHeight: 'auto' }}
                placeholder="*"
              />
              <span className="text-[10px] text-gray-400 text-center">{field.range}</span>
            </div>
          ))}
        </div>

        {/* Reference */}
        <div className="tool-glass p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            Syntax Reference
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div><code className="text-violet-600 dark:text-violet-400">*</code> — any value</div>
            <div><code className="text-violet-600 dark:text-violet-400">,</code> — list (1,3,5)</div>
            <div><code className="text-violet-600 dark:text-violet-400">-</code> — range (1-5)</div>
            <div><code className="text-violet-600 dark:text-violet-400">*/n</code> — every n</div>
          </div>
        </div>

        {/* Presets */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            Common Presets
          </h3>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p.cron)}
                type="button"
                className={`tool-btn tool-btn-secondary text-xs ${
                  cronExpression === p.cron ? 'ring-2 ring-violet-500' : ''
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Command */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
            Command
          </label>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="tool-editor w-full px-3 py-2 text-sm font-mono"
            style={{ minHeight: 'auto' }}
            placeholder="/path/to/command"
          />
        </div>

        {/* Full Output */}
        <CodeEditor
          value={fullLine}
          readOnly
          label="Full Crontab Line"
          language="bash"
        />
      </div>
    </ToolLayout>
  );
}

function describeCron(min, hour, day, month, weekday) {
  const parts = [];

  if (min === '*' && hour === '*') parts.push('Every minute');
  else if (min.startsWith('*/')) parts.push(`Every ${min.slice(2)} minutes`);
  else if (hour === '*') parts.push(`At minute ${min} of every hour`);
  else if (min === '0') parts.push(`At ${hour}:00`);
  else parts.push(`At ${hour}:${min.padStart(2, '0')}`);

  if (day !== '*' && month !== '*') parts.push(`on ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(month)-1] || month} ${day}`);
  else if (day !== '*') parts.push(`on day ${day} of the month`);
  else if (month !== '*') parts.push(`in ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(month)-1] || month}`);

  if (weekday !== '*') {
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    if (weekday.includes('-')) {
      const [s, e] = weekday.split('-').map(Number);
      parts.push(`on ${days[s]} through ${days[e]}`);
    } else {
      parts.push(`on ${days[parseInt(weekday)] || weekday}`);
    }
  }

  return parts.join(', ') || 'Every minute';
}
