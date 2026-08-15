import { useState } from "react";

type View = "home" | "today" | "plan" | "materials" | "qa" | "mastery" | "operations";
type SourceMode = "summary" | "original";

const lessonSteps = [
  { id: 1, label: "理解学习目标", time: "8 分钟" },
  { id: 2, label: "AI 总结与原文", time: "18 分钟" },
  { id: 3, label: "闭卷解释", time: "12 分钟" },
  { id: 4, label: "提交学习证据", time: "20 分钟" },
];

const navItems: { id: View; icon: string; label: string; sub: string }[] = [
  { id: "home", icon: "⌂", label: "项目首页", sub: "目标、进度与下一步" },
  { id: "today", icon: "✦", label: "今日学习", sub: "按资料一步一步学" },
  { id: "plan", icon: "⌁", label: "学习计划", sub: "6 周 · 28 个任务" },
  { id: "materials", icon: "▤", label: "我的资料", sub: "3 份已完成解析" },
  { id: "qa", icon: "◌", label: "材料问答", sub: "回答附带原文引用" },
  { id: "mastery", icon: "◔", label: "掌握与复习", sub: "3 项等待复习" },
  { id: "operations", icon: "◫", label: "运行面板", sub: "花费、延迟与 Trace" },
];

export default function App() {
  const [view, setView] = useState<View>("home");
  const [step, setStep] = useState(1);
  const [sourceMode, setSourceMode] = useState<SourceMode>("summary");
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const openToday = () => setView("today");

  return (
    <main className="app-shell">
      <Sidebar view={view} onChange={setView} />
      <section className="workspace">
        <Topbar view={view} />
        {view === "home" && <HomeView openToday={openToday} openMaterials={() => setView("materials")} />}
        {view === "today" && (
          <TodayLearning
            step={step}
            setStep={setStep}
            sourceMode={sourceMode}
            setSourceMode={setSourceMode}
            answer={answer}
            setAnswer={setAnswer}
            checked={checked}
            setChecked={setChecked}
          />
        )}
        {view === "plan" && <PlanView onStart={openToday} />}
        {view === "materials" && <MaterialsView uploaded={uploaded} onUpload={() => setUploaded(true)} />}
        {view === "qa" && <QuestionAnswerView />}
        {view === "mastery" && <MasteryView openToday={openToday} />}
        {view === "operations" && <OperationsView />}
      </section>
    </main>
  );
}

function Sidebar({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  return (
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">知</span><div><b>知行证据</b><small>自适应 AI 学习平台</small></div></div>
      <div className="project-card"><span>当前学习项目</span><b>Python 异步与 FastAPI</b><div><i style={{ width: "36%" }} /></div><small>计划第 10 / 28 天 · 36%</small></div>
      <nav aria-label="主要页面">
        {navItems.map((item) => (
          <button key={item.id} className={view === item.id ? "nav-item active" : "nav-item"} onClick={() => onChange(item.id)}>
            <span>{item.icon}</span><div><b>{item.label}</b><small>{item.sub}</small></div>
          </button>
        ))}
      </nav>
      <div className="sidebar-note"><span>今天</span><b>还剩 48 分钟</b><p>完成证据提交后，系统再决定是否解锁下一项。</p></div>
      <div className="profile"><span>刘</span><div><b>刘添儒</b><small>连续学习 12 天</small></div></div>
    </aside>
  );
}

function Topbar({ view }: { view: View }) {
  const copy: Record<View, [string, string]> = {
    home: ["学习项目", "根据你的目标、资料和学习表现持续安排"],
    today: ["今日学习", "2026 年 8 月 14 日 · 预计 58 分钟"],
    plan: ["学习计划", "由 3 份资料生成 · 计划版本 v1"],
    materials: ["我的资料", "上传、解析，并绑定到知识点和任务"],
    qa: ["材料问答", "回答只使用当前项目资料，并保留引用"],
    mastery: ["掌握与复习", "评价学习证据，安排复习与后续任务"],
    operations: ["运行面板", "模型用量、费用、延迟和执行轨迹"],
  };
  return <header className="topbar"><div><h1>{copy[view][0]}</h1><p>{copy[view][1]}</p></div><div className="top-actions"><span className="stage-pill">计划 v1 · 已发布</span><button aria-label="帮助">?</button><span className="avatar">刘</span></div></header>;
}

function HomeView({ openToday, openMaterials }: { openToday: () => void; openMaterials: () => void }) {
  return (
    <div className="wide-view home-view view-enter">
      <section className="home-hero">
        <div className="home-copy">
          <div className="status-line"><span>今日任务</span><b>理解 Task 的等待与恢复</b></div>
          <p className="eyebrow">根据你上传的资料安排</p>
          <h2>今天不用自己找内容<br />按这 4 步学就可以</h2>
          <p>系统已经从 186 页资料中定位到今天需要的内容，并准备了 AI 总结、原文入口、闭卷问题和需要提交的学习证据。</p>
          <div className="hero-actions"><button className="primary large" onClick={openToday}>开始今日学习 →</button><button className="secondary" onClick={openMaterials}>查看资料来源</button></div>
        </div>
        <div className="progress-orbit" aria-label="当前学习计划完成 36%"><div className="orbit-ring"><div><b>36%</b><span>10 / 28 个任务</span></div></div><p>本周已学习 4.2 小时</p><small>按当前速度，预计提前 3 天完成</small></div>
      </section>

      <section className="truth-banner"><div><span className="truth-icon">✓</span><div><b>今日内容已绑定真实来源</b><p>主要来源：Python 异步编程学习资料.pdf 第 32–35 页；补充来源：异步学习笔记.md 第 4 节。</p></div></div><span className="code-badge">2 个来源 · 4 个步骤</span></section>

      <div className="dashboard-grid">
        <section className="focus-card panel">
          <div className="panel-heading"><div><p className="eyebrow">今日学习路径</p><h3>先理解，再闭卷解释，最后提交证据</h3></div><span>约 58 分钟</span></div>
          <div className="focus-list">
            <article><span>01</span><div><b>理解为什么需要 Task</b><p>先建立场景和直觉，不直接堆完整项目代码。</p></div><em>8 分钟</em></article>
            <article><span>02</span><div><b>AI 总结或查看原文</b><p>默认看通俗总结，需要核对时打开对应页。</p></div><em className="now">18 分钟</em></article>
            <article><span>03</span><div><b>回答问题并提交证据</b><p>系统根据实际解释和实验结果判断是否通过。</p></div><em className="next">32 分钟</em></article>
          </div>
          <button className="text-link" onClick={openToday}>进入分步学习 →</button>
        </section>
        <aside className="source-stack panel">
          <p className="eyebrow">资料处理状态</p><h3>3 份资料已经可以用于计划</h3>
          <button onClick={openMaterials}><span className="file-icon pdf">PDF</span><div><b>Python 异步编程学习资料.pdf</b><small>86 页 · 18 个知识点</small></div><i>↗</i></button>
          <button onClick={openMaterials}><span className="file-icon md">MD</span><div><b>异步学习笔记.md</b><small>12 章 · 9 个知识点</small></div><i>↗</i></button>
          <p className="source-policy">资料不足时，系统会说明缺口，不会把模型通用知识伪装成原文内容。</p>
        </aside>
      </div>

      <section className="roadmap-strip panel">
        <div className="roadmap-title"><p className="eyebrow">当前计划中的前置关系</p><h3>系统为什么按这个顺序安排</h3></div>
        <div className="roadmap-flow">
          <article className="done"><span>✓</span><small>已掌握</small><b>协程与事件循环</b><p>理解协程怎样被事件循环推进</p></article><i>→</i>
          <article className="current"><span>10</span><small>今天</small><b>Task 的等待与恢复</b><p>说明 await 前后实际发生什么</p></article><i>→</i>
          <article><span>11</span><small>下一项</small><b>并发与并行</b><p>区分交错推进和真正同时运行</p></article><i>→</i>
          <article><span>12</span><small>之后</small><b>Semaphore 限制并发</b><p>控制同时访问上游服务的数量</p></article>
        </div>
      </section>
    </div>
  );
}

function TodayLearning({ step, setStep, sourceMode, setSourceMode, answer, setAnswer, checked, setChecked }: {
  step: number; setStep: (step: number) => void; sourceMode: SourceMode; setSourceMode: (mode: SourceMode) => void;
  answer: string; setAnswer: (answer: string) => void; checked: boolean; setChecked: (checked: boolean) => void;
}) {
  const [completed, setCompleted] = useState(false);
  const next = () => { setStep(Math.min(4, step + 1)); setChecked(false); };
  return (
    <div className="today-view view-enter">
      <section className="lesson-hero">
        <div className="lesson-heading"><div><p className="eyebrow">任务 10 · 来自你的学习计划</p><h2>理解 Task 为什么能在等待时让出控制权</h2><p>今天只学习第 32–35 页，不要求读完整章；每一步完成后再继续。</p></div><div className="hero-time"><b>58</b><span>预计分钟</span></div></div>
        <div className="stepper">{lessonSteps.map((item) => <button key={item.id} className={step === item.id ? "step current" : step > item.id ? "step done" : "step"} onClick={() => item.id <= step && setStep(item.id)}><span>{step > item.id ? "✓" : item.id}</span><div><b>{item.label}</b><small>{item.time}</small></div></button>)}</div>
      </section>
      <div className="learning-grid">
        <section className="learning-card">
          <div className="card-title"><div><span className="step-label">步骤 {step} / 4</span><h3>{lessonSteps[step - 1].label}</h3></div><span className="source-verified">✓ 来源已定位</span></div>
          {step === 1 && <GoalStep />}
          {step === 2 && <><SourceTabs mode={sourceMode} setMode={setSourceMode} />{sourceMode === "summary" ? <AiSummary /> : <OriginalPreview />}</>}
          {step === 3 && <RecallStep answer={answer} setAnswer={setAnswer} checked={checked} setChecked={setChecked} />}
          {step === 4 && <EvidenceStep checked={checked} setChecked={setChecked} />}
          <div className="lesson-actions"><button className="ghost" disabled={step === 1} onClick={() => setStep(step - 1)}>← 上一步</button><div><span>{completed ? "今天的任务已记录" : "达到本步条件后再继续"}</span>{step < 4 ? <button className="primary" onClick={next} disabled={step === 3 && !checked}>继续下一步 →</button> : <button className="primary" onClick={() => setCompleted(true)} disabled={!checked}>{completed ? "证据已提交 ✓" : "提交今日证据"}</button>}</div></div>
        </section>
        <aside className="lesson-rail">
          <section className="rail-card today-goal"><p className="eyebrow">学完后你能做到</p><h3>不用背定义，也能解释运行过程</h3><ul><li><span>1</span>说清 Task 等待时发生了什么</li><li><span>2</span>区分“当前任务暂停”和“程序停止”</li><li><span>3</span>用最小实验验证自己的理解</li></ul></section>
          <section className="rail-card material-origin"><div className="file-row"><span className="file-icon pdf">PDF</span><div><small>本节主要来源</small><b>Python 异步编程学习资料.pdf</b><p>第 32–35 页 · 第 2.3 节</p></div></div><button onClick={() => { setStep(2); setSourceMode("original"); }}>打开对应原文 ↗</button><p className="source-policy">AI 总结只根据这 4 页生成；额外解释会明确标为模型补充。</p></section>
          <section className="rail-card implementation-card"><p className="eyebrow">为什么今天学这个</p><div><b>昨天</b><span>已经理解协程与事件循环</span></div><div><b>今天</b><span>建立 Task 等待与恢复的直觉</span></div><div><b>明天</b><span>进入并发和并行的区别</span></div></section>
        </aside>
      </div>
    </div>
  );
}

function GoalStep() {
  return <div className="goal-pane"><div className="goal-lead"><span>现实问题</span><h4>网络请求在等待结果时，程序难道只能停在那里吗？</h4><p>如果一个请求等待两秒就让整个程序停两秒，服务器会浪费大量可用时间。Task 和事件循环让程序能在等待期间推进其他已经就绪的工作。</p></div><div className="goal-grid"><article><span>今天要理解</span><b>等待时谁暂停</b><p>暂停的是当前 Task，不是整个进程。</p></article><article><span>今天要说清</span><b>控制权去了哪里</b><p>先交回事件循环，再安排其他就绪任务。</p></article><article><span>今天的产出</span><b>解释 + 最小实验</b><p>用自己的话和运行结果证明理解。</p></article></div><div className="note-box"><b>今天暂时不扩展</b><p>多线程、CPU 并行和复杂调度策略留到后续任务；这里只补理解当前内容所需的最少基础。</p></div></div>;
}

function SourceTabs({ mode, setMode }: { mode: SourceMode; setMode: (mode: SourceMode) => void }) {
  return <div className="source-tabs" role="tablist" aria-label="学习内容显示方式"><button className={mode === "summary" ? "active" : ""} onClick={() => setMode("summary")}><span>✦</span><div><b>AI 总结</b><small>通俗整理，约 6 分钟</small></div></button><button className={mode === "original" ? "active" : ""} onClick={() => setMode("original")}><span>▤</span><div><b>查看原文</b><small>PDF 第 32–35 页</small></div></button></div>;
}

function AiSummary() {
  return <div className="summary-pane"><div className="summary-lead"><span>一句话先理解</span><p>Task 像一个正在办事的人：遇到必须等待的网络结果时，先把执行机会还给事件循环；结果到了，再从原位置继续。</p></div><div className="concept-grid"><article><span>01</span><div><b>Task 是什么</b><p>事件循环可以调度的一项具体工作，并记录执行到了哪里。</p></div></article><article><span>02</span><div><b>await 做什么</b><p>结果没准备好时暂停当前 Task，不让整个程序一起停住。</p></div></article><article><span>03</span><div><b>怎样恢复</b><p>结果到达后，事件循环再次安排原 Task 从 await 后继续。</p></div></article></div><div className="source-figure"><div className="figure-head"><div><span>AI 整理图 · 非原文图片</span><b>一个 Task 的等待与恢复</b></div><small>根据原文第 34 页整理</small></div><div className="quality-flow"><article><span>1</span><b>Task A 运行</b><small>执行到 await</small></article><i>→</i><article><span>2</span><b>等待网络</b><small>交回控制权</small></article><i>→</i><article><span>3</span><b>事件循环</b><small>先推进 Task B</small></article><i>→</i><article><span>4</span><b>Task A 恢复</b><small>从 await 后继续</small></article></div></div><div className="remember-box"><b>最容易混淆</b><p>暂停的是当前 Task，不是整个线程或进程；等待期间事件循环可以运行其他已经就绪的 Task。</p></div></div>;
}

function OriginalPreview() {
  return <div className="original-pane"><div className="document-tabs"><button className="active">Python 异步编程学习资料.pdf</button><button>第 34 / 86 页</button></div><article className="markdown-page pdf-like"><small>2.3 Task 的等待与恢复</small><h4>Task 如何把控制权交还事件循环</h4><p>当协程执行到一个尚未完成的可等待对象时，当前 Task 会挂起，并由事件循环调度其他已经就绪的 Task。</p><div className="original-diagram"><span>Task A</span><b>await I/O</b><span>Event loop</span><b>resume</b><span>Task A</span></div><p className="highlight">需要注意：挂起的是当前 Task，而不是承载事件循环的整个线程。I/O 完成后，Task 会重新进入可运行状态。</p><p>因此，异步程序可以在单个线程中交错推进多个 I/O 密集型任务。</p></article><div className="original-note"><span>✦</span><p><b>原文查看</b>正式版本会直接打开上传文件的对应页，并尽可能保留图片、图表和原始排版。</p></div></div>;
}

function RecallStep({ answer, setAnswer, checked, setChecked }: { answer: string; setAnswer: (v: string) => void; checked: boolean; setChecked: (v: boolean) => void }) {
  return <div className="recall-pane"><div className="question-badge">先不看总结，用自己的话回答</div><h4>Task A 在等待网络数据时，为什么 Task B 还能继续运行？</h4><p>不需要背专业定义，只要把实际发生的顺序说清楚。</p><textarea value={answer} onChange={(event) => { setAnswer(event.target.value); setChecked(false); }} placeholder="例如：Task A 执行到……然后事件循环……" /><div className="answer-foot"><span>{answer.length} 字 · 建议 40–120 字</span><button onClick={() => setChecked(true)} disabled={answer.trim().length < 18}>检查我的理解</button></div>{checked && <div className="feedback good"><span>✓</span><div><b>理解方向正确</b><p>你已经说明 Task A 会在等待时交回控制权。再补充一点：网络结果到达后，Task A 会从 await 后面继续，而不是从头运行。</p></div></div>}</div>;
}

function EvidenceStep({ checked, setChecked }: { checked: boolean; setChecked: (v: boolean) => void }) {
  return <div className="evidence-pane"><div className="evidence-title"><span>结构化实验报告</span><h4>提交今天的可验证产出</h4><p>任务不会因为点击“学会了”直接完成。系统会先检查解释、运行结果和验收标准。</p></div><div className="report-grid"><label>实验名称<input defaultValue="两个 Task 的等待与恢复" /></label><label>执行结果<select defaultValue="passed"><option value="passed">运行成功</option><option value="partial">部分成功</option><option value="failed">运行失败</option></select></label><label className="full">我的结论<textarea defaultValue="Task A 等待时把控制权交回事件循环，因此 Task B 可以先继续；等待结束后 Task A 从 await 后恢复。" /></label><label>预计耗时<input defaultValue="20 分钟" /></label><label>实际耗时<input defaultValue="18 分钟" /></label></div><label className="confirm-row"><input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} /><span>我已经实际运行最小例子，并确认结论来自自己的实验结果。</span></label><div className="rubric-preview"><b>提交后系统将检查</b><span>执行顺序完整</span><span>没有混淆并行</span><span>运行结果可复现</span><span>结论符合资料</span></div></div>;
}

function PlanView({ onStart }: { onStart: () => void }) {
  const items = [
    ["已完成", "协程与事件循环", "学习资料第 18–31 页", "done"],
    ["今天", "Task 的等待与恢复", "学习资料第 32–35 页", "current"],
    ["明天", "并发与并行的区别", "学习资料第 36–42 页", "next"],
    ["8 月 16 日", "Semaphore 并发限制", "异步笔记第 4 节", "next"],
    ["8 月 17 日", "流式响应中的等待", "FastAPI 补充资料第 11–15 页", "next"],
  ];
  return <div className="wide-view view-enter"><section className="plan-hero"><div><p className="eyebrow">计划 v1 · 由 3 份资料生成并已确认</p><h2>6 周掌握 Python 异步与 FastAPI</h2><p>系统结合你的基础、每天 75 分钟预算和资料中的前置关系，将内容拆成 28 个可验收任务。</p><div className="source-chips"><span>Python 异步编程学习资料.pdf</span><span>异步学习笔记.md</span><span>FastAPI 补充资料.pdf</span></div></div><div className="plan-score"><b>36%</b><span>已完成 10 / 28 个任务</span><i><em style={{ width: "36%" }} /></i><button onClick={onStart}>继续今日学习 →</button></div></section><div className="plan-grid"><section className="timeline-card"><div className="panel-title"><div><span>第 2 周</span><h3>Task、并发与任务调度</h3></div><small>本周 5 个任务 · 预计 5.5 小时</small></div><div className="timeline">{items.map((item, index) => <article className={item[3]} key={item[1]}><div className="timeline-node">{item[3] === "done" ? "✓" : index + 1}</div><div><small>{item[0]}</small><b>{item[1]}</b><p>{item[2]}</p></div>{item[3] === "current" && <button onClick={onStart}>开始学习</button>}{item[3] === "done" && <em>证据已通过</em>}</article>)}</div></section><aside className="plan-side"><section><p className="eyebrow">生成依据</p><h3>为什么是这个顺序？</h3><ol><li><span>1</span><p>先从资料中提取知识点和前置关系</p></li><li><span>2</span><p>结合已有基础跳过重复内容</p></li><li><span>3</span><p>按每天 75 分钟拆成可完成任务</p></li></ol></section><section className="plan-rule"><b>计划不会被静默改写</b><p>新资料或学习表现影响顺序时，系统先展示调整原因、版本差异和受影响任务，由你确认后再发布。</p></section></aside></div></div>;
}

function MaterialsView({ uploaded, onUpload }: { uploaded: boolean; onUpload: () => void }) {
  const files = [
    { type: "PDF", name: "Python 异步编程学习资料.pdf", meta: "86 页 · 18 个知识点 · 解析完成", status: "用于计划", color: "red" },
    { type: "MD", name: "异步学习笔记.md", meta: "12 章 · 9 个知识点 · 解析完成", status: "用于计划", color: "blue" },
    { type: "PDF", name: "FastAPI 补充资料.pdf", meta: "100 页 · 14 个知识点 · 解析完成", status: "用于计划", color: "red" },
  ];
  if (uploaded) files.unshift({ type: "PDF", name: "并发编程课程讲义.pdf", meta: "正在解析第 42 / 64 页", status: "解析中 66%", color: "amber" });
  return <div className="wide-view view-enter"><section className="materials-hero"><div><p className="eyebrow">三种资料入口 · PDF / Markdown / TXT</p><h2>从自己的资料开始，也可以先生成草案</h2><p>上传资料、选择平台模板，或暂时不提供资料。模型生成的无资料内容会明确标记，不能伪造出处。</p></div><button className="primary" onClick={onUpload}>＋ 上传新资料</button></section><div className="entry-grid"><article className="selected"><span>01</span><b>上传自己的资料</b><p>保留文件、页码、章节、版本和内容哈希。</p><em>当前项目选择</em></article><article><span>02</span><b>使用平台模板</b><p>从人工维护路线开始，再按基础和时间调整。</p><em>可以切换</em></article><article><span>03</span><b>模型生成草案</b><p>标记“未绑定用户资料”，确认后才能发布。</p><em>可以切换</em></article></div><div className="upload-zone" onClick={onUpload} role="button" tabIndex={0}><span>⇧</span><h3>{uploaded ? "新资料已加入解析队列" : "拖入 PDF、Markdown 或 TXT 文件"}</h3><p>{uploaded ? "解析完成后，系统会先展示它对当前计划的影响。" : "或点击这里选择文件 · 上传后会异步解析和建立索引"}</p></div><section className="file-list"><div className="panel-title"><div><span>当前项目资料</span><h3>{files.length} 份资料</h3></div><small>所有总结都能回到原文位置</small></div>{files.map((file) => <article key={file.name}><span className={`file-type ${file.color}`}>{file.type}</span><div><b>{file.name}</b><p>{file.meta}</p></div><span className={file.status.includes("解析中") ? "file-status parsing" : "file-status"}>{file.status}</span><button aria-label={`查看 ${file.name}`}>···</button></article>)}</section></div>;
}

function QuestionAnswerView() {
  const [question, setQuestion] = useState("Task 等待网络结果时，事件循环具体做了什么？");
  const [asked, setAsked] = useState(true);
  return <div className="wide-view qa-view view-enter"><section className="qa-hero panel"><p className="eyebrow">只回答当前项目资料中的内容</p><h2>带着引用向自己的资料提问</h2><div className="qa-input"><input value={question} onChange={(event) => { setQuestion(event.target.value); setAsked(false); }} /><button className="primary" onClick={() => setAsked(true)}>提问</button></div><div className="qa-options"><span>检索路径：混合检索</span><span>资料不足时拒绝回答</span><span>显示文件与页码</span></div></section>{asked && <div className="qa-grid"><section className="answer-card panel"><div className="answer-label"><span>AI 回答</span><small>使用 2 个资料片段</small></div><h3>等待期间，事件循环会调度其他已经就绪的 Task</h3><p>当 Task A 执行到尚未完成的网络等待时，它会暂停并交回控制权。事件循环不会继续执行 Task A 的后续代码，而是从就绪任务中选择可以运行的工作，例如 Task B。网络结果到达后，Task A 再从原来的 <code>await</code> 后继续。</p><div className="citation-row"><button>[1] 异步编程资料.pdf · 第 34 页</button><button>[2] 异步学习笔记.md · 第 4 节</button></div><div className="answer-warning"><b>资料边界</b><span>回答没有使用联网内容；“就绪队列”的更深实现细节不在当前资料中。</span></div></section><aside className="citation-card panel"><p className="eyebrow">引用 [1]</p><h3>原文片段</h3><small>Python 异步编程学习资料.pdf · 第 34 页</small><blockquote>当前 Task 会挂起，并由事件循环调度其他已经就绪的 Task。I/O 完成后，原 Task 再次获得执行机会。</blockquote><button className="secondary">打开原文第 34 页 ↗</button><div className="retrieval-meta"><span>相关度 0.91</span><span>引用已覆盖</span></div></aside></div>}</div>;
}

function MasteryView({ openToday }: { openToday: () => void }) {
  return <div className="wide-view view-enter"><section className="mastery-hero panel"><div><p className="eyebrow">基于已通过证据更新</p><h2>异步编程综合掌握度 72%</h2><p>当前优势是协程和事件循环；Task 取消与并发限制仍容易混淆。系统已把三个知识点加入复习队列。</p><button className="primary" onClick={openToday}>继续今日学习 →</button></div><div className="mastery-ring active"><div><b>72</b><span>综合掌握度</span></div></div></section><div className="empty-grid"><section className="panel review-panel"><p className="eyebrow">复习队列</p><h3>接下来需要复习</h3><div className="review-list"><article><span>今天</span><div><b>Task 的等待与恢复</b><small>上次解释缺少恢复位置</small></div><em>高风险</em></article><article><span>明天</span><div><b>取消传播</b><small>最近一次测试部分通过</small></div><em>中风险</em></article><article><span>3 天后</span><div><b>Semaphore 并发限制</b><small>首次学习后安排复习</small></div><em>正常</em></article></div></section><section className="panel"><p className="eyebrow">掌握度依据</p><ul className="signal-list"><li><span>01</span>文本解释与 Rubric 评价</li><li><span>02</span>结构化实验和测试结果</li><li><span>03</span>实际耗时与失败类型</li><li><span>04</span>历史复习表现与遗忘风险</li></ul></section></div></div>;
}

function OperationsView() {
  const [trace, setTrace] = useState(0);
  const traces = [
    { time: "今天 14:32", task: "生成今日学习总结", route: "资料检索 → Qwen", token: "2,184", cost: "¥0.18", latency: "1.42s", status: "成功" },
    { time: "今天 14:08", task: "评价用户解释", route: "Rubric → Qwen", token: "1,026", cost: "¥0.09", latency: "2.18s", status: "成功" },
    { time: "今天 09:16", task: "生成六周学习计划", route: "长上下文 → Qwen", token: "8,462", cost: "¥0.74", latency: "4.86s", status: "成功" },
    { time: "昨天 21:45", task: "回答材料问题", route: "资料不足 → 拒答", token: "356", cost: "¥0.02", latency: "0.91s", status: "已拒答" },
  ];
  const current = traces[trace];
  return <div className="wide-view operations-view view-enter"><section className="operations-intro"><div><p className="eyebrow">开发、实验与答辩面板 · 不改变学习状态</p><h2>每一次模型调用花了多少、为什么这样运行</h2><p>当前正式云 Provider 只有 Qwen。面板记录 Token、费用、成功率、延迟、错误类别和 Trace，不展示不存在的跨厂商路由。</p></div><div className="budget-status"><span>本月预算</span><b>¥12.86 <small>/ ¥40</small></b><i><em style={{ width: "32%" }} /></i><p>已使用 32% · 预计月底 ¥24.30</p></div></section><section className="metric-grid"><Metric label="本周模型花费" value="¥12.86" note="较上周 ↓ 8.4%" tone="cost" /><Metric label="本周模型调用" value="184 次" note="其中 23 次命中缓存" tone="calls" /><Metric label="P95 响应延迟" value="2.41s" note="目标低于 3 秒" tone="latency" /><Metric label="请求成功率" value="98.7%" note="过去 7 天 ↑ 0.8%" tone="success" /></section><div className="operations-grid"><section className="cost-card"><div className="operations-title"><div><p className="eyebrow">最近 7 天</p><h3>每日模型花费</h3></div><span>总计 ¥12.86</span></div><div className="cost-chart">{[42, 56, 38, 72, 51, 84, 64].map((height, index) => <div className="cost-day" key={index}><div><i style={{ height: `${height}%` }} /><b>¥{[1.42, 1.83, 1.17, 2.25, 1.54, 2.68, 1.97][index]}</b></div><span>{["周六", "周日", "周一", "周二", "周三", "周四", "今天"][index]}</span></div>)}</div><div className="cost-breakdown"><div><span className="legend-dot" /><p><b>学习总结 46%</b><small>¥5.92</small></p></div><div><span className="legend-dot planning" /><p><b>计划生成 31%</b><small>¥3.99</small></p></div></div></section><aside className="saving-card"><p className="eyebrow">当前正式模型层</p><b>Qwen</b><p>非流式、流式、结构化输出和 usage 使用统一协议；模型错误在边界内分类。</p><div><span>默认模型</span><b>qwen3.8-max</b></div><div><span>缓存输入 Token</span><b>可记录</b></div><small>费用和调用记录为原型模拟数据，正式版本按真实 API usage 计算。</small></aside></div><section className="trace-section"><div className="operations-title"><div><p className="eyebrow">最近执行轨迹</p><h3>点开一次调用，看清费用怎样产生</h3></div><button>导出使用记录</button></div><div className="trace-layout"><div className="trace-list"><div className="trace-head"><span>时间 / 功能</span><span>调用路径</span><span>Token</span><span>花费</span><span>延迟</span><span>状态</span></div>{traces.map((item, index) => <button className={trace === index ? "trace-item selected" : "trace-item"} key={item.time + item.task} onClick={() => setTrace(index)}><span><small>{item.time}</small><b>{item.task}</b></span><span>{item.route}</span><span>{item.token}</span><strong>{item.cost}</strong><span>{item.latency}</span><em className="ok">{item.status}</em></button>)}</div><aside className="trace-detail"><p className="eyebrow">Trace 详情</p><h3>{current.task}</h3><p className="trace-summary">本次调用共使用 {current.token} Token，产生 {current.cost} 费用，总耗时 {current.latency}。</p><div className="trace-flow"><span><i>12ms</i>读取当前学习任务</span><span><i>84ms</i>检索对应资料片段</span><span><i>147ms</i>筛选并核对来源</span><span><i>1.08s</i>调用 Qwen 生成内容</span><span><i>38ms</i>验证输出和引用</span></div><div className="trace-meta"><p><span>Provider</span>qwen</p><p><span>模型</span>qwen3.8-max</p><p><span>输入 Token</span>1,746</p><p><span>输出 Token</span>438</p></div></aside></div></section></div>;
}

function Metric({ label, value, note, tone }: { label: string; value: string; note: string; tone: string }) {
  return <article className={`metric-card ${tone}`}><span className="metric-icon" /><p>{label}</p><b>{value}</b><small>{note}</small></article>;
}

