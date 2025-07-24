import React, { useState, useEffect } from 'react';

const REQUIRED_FIELDS = ['companyName', 'industry', 'website', 'goals', 'challenges', 'toolsUsed'];

const LeadScoringForm = () => {
  const [leadData, setLeadData] = useState({
    companyName: '',
    industry: '',
    website: '',
    goals: '',
    challenges: '',
    toolsUsed: '',
  });

  const [score, setScore] = useState(null);
  const [reason, setReason] = useState('');
  const [completedPercent, setCompletedPercent] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const filled = REQUIRED_FIELDS.filter((field) => leadData[field].trim() !== '');
    setCompletedPercent(Math.round((filled.length / REQUIRED_FIELDS.length) * 100));
  }, [leadData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeadData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setScore(null);
    setReason('');

    try {
      const res = await fetch('http://localhost:8000/analyze-lead/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Unknown',
          company: leadData.companyName,
          industry: leadData.industry,
          goals: leadData.goals,
          challenges: leadData.challenges,
          tools: leadData.toolsUsed,
          website: leadData.website,
        }),
      });

      const data = await res.json();
      setScore(data.score || 'N/A');
      setReason(data.reason || 'No reason provided.');
    } catch (err) {
      setScore('❌ Error');
      setReason('Could not connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-xl rounded-2xl space-y-6">
      <h2 className="text-2xl font-bold mb-4">🧠 AI-Powered Lead Scoring Assistant</h2>

      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-4">
        <input type="text" name="companyName" placeholder="Company Name" value={leadData.companyName} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="industry" placeholder="Industry" value={leadData.industry} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="url" name="website" placeholder="Company Website" value={leadData.website} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="goals" placeholder="What are their growth goals?" value={leadData.goals} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="challenges" placeholder="What challenges do they face?" value={leadData.challenges} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="toolsUsed" placeholder="What tools are they currently using?" value={leadData.toolsUsed} onChange={handleChange} className="w-full p-2 border rounded" />

       <button
  type="submit"
  disabled={loading || completedPercent === 0}
  className={`w-full py-2 px-4 font-semibold rounded-xl transition duration-300 text-white shadow-md ${
    loading || completedPercent === 0
      ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
  }`}
>
  {loading
    ? '⏳ Analyzing Lead...'
    : score === null
    ? '🚀 Score This Lead'
    : '🔄 Update Lead Score'}
</button>

      </form>

      {score !== null && (
        <div className="text-center mt-4">
          <p className="text-lg font-semibold">Lead Score: <span className="text-blue-600">{score}%</span></p>
          <p className="text-sm mt-2 text-gray-700">📌 Reason: {reason}</p>
        </div>
      )}

      <div className="mt-6">
        <p className="text-sm text-gray-600 mb-1">🔄 Lead profile: {completedPercent}% complete</p>
        <div className="w-full h-3 bg-gray-200 rounded-full">
          <div className="h-3 bg-green-500 rounded-full transition-all" style={{ width: `${completedPercent}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default LeadScoringForm;
