"use strict";
function e(t, i) {
  const n = { ...t };
  for (const o in i)
    "object" != typeof t[o] || null === t[o] || Array.isArray(t[o])
      ? void 0 !== i[o] && (n[o] = i[o])
      : (n[o] = e(t[o], i[o]));
  return n;
}
Object.defineProperty(exports, "__esModule", { value: !0 });
const t = {
    mobile: {
      disabled_features: [
        "left_toolbar",
        "header_widget",
        "timeframes_toolbar",
        "edit_buttons_in_legend",
        "context_menus",
        "control_bar",
        "border_around_the_chart",
      ],
      enabled_features: [],
    },
  },
  i = {
    width: 800,
    height: 500,
    interval: "1D",
    timezone: "Etc/UTC",
    container: "",
    library_path: "",
    locale: "en",
    widgetbar: {
      details: !1,
      watchlist: !1,
      watchlist_settings: { default_symbols: [] },
    },
    overrides: { "mainSeriesProperties.showCountdown": !1 },
    studies_overrides: {},
    trading_customization: { position: {}, order: {} },
    brokerConfig: { configFlags: {} },
    fullscreen: !1,
    autosize: !1,
    disabled_features: [],
    enabled_features: [],
    debug: !1,
    logo: {},
    time_frames: [
      { text: "5y", resolution: "1W" },
      { text: "1y", resolution: "1W" },
      { text: "6m", resolution: "120" },
      { text: "3m", resolution: "60" },
      { text: "1m", resolution: "30" },
      { text: "5d", resolution: "5" },
      { text: "1d", resolution: "1" },
    ],
    client_id: "0",
    user_id: "0",
    charts_storage_api_version: "1.0",
    favorites: { intervals: [], chartTypes: [] },
  };
let n = !1;
function o() {
  return "CL v22.032 (internal id e2a841ff @ 2022-07-06T11:53:07.702Z)";
}
const s = class {
  constructor(o) {
    if (
      ((this._id = `tradingview_${((1048576 * (1 + Math.random())) | 0)
        .toString(16)
        .substring(1)}`),
      (this._ready = !1),
      (this._readyHandlers = []),
      (this._onWindowResize = this._autoResizeChart.bind(this)),
      !o.datafeed)
    )
      throw new Error("Datafeed is not defined");
    if (((this._options = e(i, o)), o.preset)) {
      const e = t[o.preset];
      e
        ? (void 0 !== this._options.disabled_features
            ? (this._options.disabled_features =
                this._options.disabled_features.concat(e.disabled_features))
            : (this._options.disabled_features = e.disabled_features),
          void 0 !== this._options.enabled_features
            ? (this._options.enabled_features =
                this._options.enabled_features.concat(e.enabled_features))
            : (this._options.enabled_features = e.enabled_features))
        : console.warn("Unknown preset: `" + o.preset + "`");
    }
    "Dark" === this._options.theme &&
      void 0 === this._options.loading_screen &&
      (this._options.loading_screen = { backgroundColor: "#131722" }),
      this._options.debug &&
        (n ||
          ((n = !0),
          console.log(
            "Using CL v22.032 (internal id e2a841ff @ 2022-07-06T11:53:07.702Z)"
          ))),
      this._create();
  }
  onChartReady(e) {
    this._ready ? e.call(this) : this._readyHandlers.push(e);
  }
  headerReady() {
    return this._innerWindowLoaded.then(() =>
      this._innerWindow().headerReady()
    );
  }
  onGrayedObjectClicked(e) {
    this._doWhenInnerApiLoaded((t) => {
      t.onGrayedObjectClicked(e);
    });
  }
  onShortcut(e, t) {
    this._doWhenInnerWindowLoaded((i) => {
      i.createShortcutAction(e, t);
    });
  }
  subscribe(e, t) {
    this._doWhenInnerApiLoaded((i) => {
      i.subscribe(e, t);
    });
  }
  unsubscribe(e, t) {
    this._doWhenInnerApiLoaded((i) => {
      i.unsubscribe(e, t);
    });
  }
  chart(e) {
    return this._innerAPI().chart(e);
  }
  getLanguage() {
    return this._options.locale;
  }
  setSymbol(e, t, i) {
    this._innerAPI().changeSymbol(e, t, i);
  }
  remove() {
    window.removeEventListener("resize", this._onWindowResize),
      this._readyHandlers.splice(0, this._readyHandlers.length),
      delete window[this._id],
      this._iFrame.parentNode &&
        this._iFrame.parentNode.removeChild(this._iFrame);
  }
  closePopupsAndDialogs() {
    this._doWhenInnerApiLoaded((e) => {
      e.closePopupsAndDialogs();
    });
  }
  selectLineTool(e) {
    this._innerAPI().selectLineTool(e);
  }
  selectedLineTool() {
    return this._innerAPI().selectedLineTool();
  }
  save(e) {
    this._innerAPI().saveChart(e);
  }
  load(e, t) {
    this._innerAPI().loadChart({ json: e, extendedData: t });
  }
  getSavedCharts(e) {
    this._innerAPI().getSavedCharts(e);
  }
  loadChartFromServer(e) {
    this._innerAPI().loadChartFromServer(e);
  }
  saveChartToServer(e, t, i) {
    this._innerAPI().saveChartToServer(e, t, i);
  }
  removeChartFromServer(e, t) {
    this._innerAPI().removeChartFromServer(e, t);
  }
  onContextMenu(e) {
    this._doWhenInnerApiLoaded((t) => {
      t.onContextMenu(e);
    });
  }
  createButton(e) {
    return this._innerWindow().createButton(e);
  }
  createDropdown(e) {
    return this._innerWindow().createDropdown(e);
  }
  showNoticeDialog(e) {
    this._doWhenInnerApiLoaded((t) => {
      t.showNoticeDialog(e);
    });
  }
  showConfirmDialog(e) {
    this._doWhenInnerApiLoaded((t) => {
      t.showConfirmDialog(e);
    });
  }
  showLoadChartDialog() {
    this._innerAPI().showLoadChartDialog();
  }
  showSaveAsChartDialog() {
    this._innerAPI().showSaveAsChartDialog();
  }
  symbolInterval() {
    return this._innerAPI().getSymbolInterval();
  }
  mainSeriesPriceFormatter() {
    return this._innerAPI().mainSeriesPriceFormatter();
  }
  getIntervals() {
    return this._innerAPI().getIntervals();
  }
  getStudiesList() {
    return this._innerAPI().getStudiesList();
  }
  getStudyInputs(e) {
    return this._innerAPI().getStudyInputs(e);
  }
  addCustomCSSFile(e) {
    this._innerWindow().addCustomCSSFile(e);
  }
  applyOverrides(t) {
    (this._options = e(this._options, { overrides: t })),
      this._doWhenInnerWindowLoaded((e) => {
        e.applyOverrides(t);
      });
  }
  applyStudiesOverrides(e) {
    this._doWhenInnerWindowLoaded((t) => {
      t.applyStudiesOverrides(e);
    });
  }
  watchList() {
    return this._innerAPI().watchlist();
  }
  news() {
    return this._innerAPI().news();
  }
  widgetbar() {
    return this._innerAPI().widgetbar();
  }
  activeChart() {
    return this._innerAPI().activeChart();
  }
  chartsCount() {
    return this._innerAPI().chartsCount();
  }
  layout() {
    return this._innerAPI().layout();
  }
  setLayout(e) {
    this._innerAPI().setLayout(e);
  }
  layoutName() {
    return this._innerAPI().layoutName();
  }
  changeTheme(e, t) {
    return this._innerWindow().changeTheme(e, t);
  }
  getTheme() {
    return this._innerWindow().getTheme();
  }
  takeScreenshot() {
    this._doWhenInnerApiLoaded((e) => {
      e.takeScreenshot();
    });
  }
  lockAllDrawingTools() {
    return this._innerAPI().lockAllDrawingTools();
  }
  hideAllDrawingTools() {
    return this._innerAPI().hideAllDrawingTools();
  }
  drawOnAllCharts(e) {
    this._innerAPI().drawOnAllCharts(e);
  }
  magnetEnabled() {
    return this._innerAPI().magnetEnabled();
  }
  magnetMode() {
    return this._innerAPI().magnetMode();
  }
  undoRedoState() {
    return this._innerAPI().undoRedoState();
  }
  setIntervalLinkingEnabled(e) {
    this._innerAPI().setIntervalLinkingEnabled(e);
  }
  setTimeFrame(e) {
    this._innerAPI().setTimeFrame(e);
  }
  symbolSync() {
    return this._innerAPI().symbolSync();
  }
  intervalSync() {
    return this._innerAPI().intervalSync();
  }
  crosshairSync() {
    return this._innerAPI().crosshairSync();
  }
  timeSync() {
    return this._innerAPI().timeSync();
  }
  getAllFeatures() {
    return this._innerWindow().getAllFeatures();
  }
  clearUndoHistory() {
    return this._innerAPI().clearUndoHistory();
  }
  undo() {
    return this._innerAPI().undo();
  }
  redo() {
    return this._innerAPI().redo();
  }
  startFullscreen() {
    this._innerAPI().startFullscreen();
  }
  exitFullscreen() {
    this._innerAPI().exitFullscreen();
  }
  takeClientScreenshot(e) {
    return this._innerAPI().takeClientScreenshot(e);
  }
  navigationButtonsVisibility() {
    return this._innerWindow().getNavigationButtonsVisibility();
  }
  paneButtonsVisibility() {
    return this._innerWindow().getPaneButtonsVisibility();
  }
  dateFormat() {
    return this._innerWindow().getDateFormat();
  }
  _innerAPI() {
    return this._innerWindow().tradingViewApi;
  }
  _innerWindow() {
    return this._iFrame.contentWindow;
  }
  _doWhenInnerWindowLoaded(e) {
    this._ready
      ? e(this._innerWindow())
      : this._innerWindowLoaded.then(() => {
          e(this._innerWindow());
        });
  }
  _doWhenInnerApiLoaded(e) {
    this._doWhenInnerWindowLoaded((t) => {
      t.doWhenApiIsReady(() => e(this._innerAPI()));
    });
  }
  _autoResizeChart() {
    this._options.fullscreen &&
      (this._iFrame.style.height = window.innerHeight + "px");
  }
  _create() {
    const e = this._render();
    this._options.container_id &&
      console.warn(
        "`container_id` is now deprecated. Please use `container` instead to either still pass a string or an `HTMLElement`."
      );
    const t = this._options.container_id || this._options.container,
      i = "string" == typeof t ? document.getElementById(t) : t;
    if (null === i)
      throw new Error(`There is no such element - #${this._options.container}`);
    (i.innerHTML = e), (this._iFrame = i.querySelector(`#${this._id}`));
    const n = this._iFrame;
    (this._options.autosize || this._options.fullscreen) &&
      ((n.style.width = "100%"),
      this._options.fullscreen || (n.style.height = "100%")),
      window.addEventListener("resize", this._onWindowResize),
      this._onWindowResize(),
      (this._innerWindowLoaded = new Promise((e) => {
        const t = () => {
          n.removeEventListener("load", t, !1), e();
        };
        n.addEventListener("load", t, !1);
      })),
      this._innerWindowLoaded.then(() => {
        this._innerWindow().widgetReady(() => {
          this._ready = !0;
          for (const e of this._readyHandlers)
            try {
              e.call(this);
            } catch (e) {
              console.error(e);
            }
          this._innerWindow().initializationFinished();
        });
      });
  }
  _render() {
    const e = window;
    if (
      ((e[this._id] = {
        datafeed: this._options.datafeed,
        customFormatters:
          this._options.custom_formatters || this._options.customFormatters,
        brokerFactory:
          this._options.broker_factory || this._options.brokerFactory,
        overrides: this._options.overrides,
        studiesOverrides: this._options.studies_overrides,
        tradingCustomization: this._options.trading_customization,
        disabledFeatures: this._options.disabled_features,
        enabledFeatures: this._options.enabled_features,
        brokerConfig: this._options.broker_config || this._options.brokerConfig,
        restConfig: this._options.restConfig,
        favorites: this._options.favorites,
        logo: this._options.logo,
        numeric_formatting: this._options.numeric_formatting,
        rss_news_feed: this._options.rss_news_feed,
        newsProvider: this._options.news_provider,
        loadLastChart: this._options.load_last_chart,
        saveLoadAdapter: this._options.save_load_adapter,
        loading_screen: this._options.loading_screen,
        settingsAdapter: this._options.settings_adapter,
        getCustomIndicators: this._options.custom_indicators_getter,
        additionalSymbolInfoFields: this._options.additional_symbol_info_fields,
        headerWidgetButtonsMode: this._options.header_widget_buttons_mode,
        customTranslateFunction: this._options.custom_translate_function,
        symbolSearchComplete: this._options.symbol_search_complete,
        contextMenu: this._options.context_menu,
        settingsOverrides: this._options.settings_overrides,
      }),
      this._options.saved_data)
    )
      (e[this._id].chartContent = { json: this._options.saved_data }),
        this._options.saved_data_meta_info &&
          (e[this._id].chartContentExtendedData =
            this._options.saved_data_meta_info);
    else if (!this._options.load_last_chart && !this._options.symbol)
      throw new Error(
        "Symbol is not defined: either 'symbol' or 'load_last_chart' option must be set"
      );
    const t =
      (this._options.library_path || "") +
      `${encodeURIComponent(
        this._options.locale
      )}-tv-chart.e2a841ff.html#symbol=` +
      encodeURIComponent(this._options.symbol || "") +
      "&interval=" +
      encodeURIComponent(this._options.interval) +
      (this._options.timeframe
        ? "&timeframe=" + encodeURIComponent(this._options.timeframe)
        : "") +
      (this._options.toolbar_bg
        ? "&toolbarbg=" +
          encodeURIComponent(this._options.toolbar_bg.replace("#", ""))
        : "") +
      (this._options.studies_access
        ? "&studiesAccess=" +
          encodeURIComponent(JSON.stringify(this._options.studies_access))
        : "") +
      "&widgetbar=" +
      encodeURIComponent(JSON.stringify(this._options.widgetbar)) +
      (this._options.drawings_access
        ? "&drawingsAccess=" +
          encodeURIComponent(JSON.stringify(this._options.drawings_access))
        : "") +
      "&timeFrames=" +
      encodeURIComponent(JSON.stringify(this._options.time_frames)) +
      "&locale=" +
      encodeURIComponent(this._options.locale) +
      "&uid=" +
      encodeURIComponent(this._id) +
      "&clientId=" +
      encodeURIComponent(String(this._options.client_id)) +
      "&userId=" +
      encodeURIComponent(String(this._options.user_id)) +
      (this._options.charts_storage_url
        ? "&chartsStorageUrl=" +
          encodeURIComponent(this._options.charts_storage_url)
        : "") +
      (this._options.charts_storage_api_version
        ? "&chartsStorageVer=" +
          encodeURIComponent(this._options.charts_storage_api_version)
        : "") +
      (this._options.custom_css_url
        ? "&customCSS=" + encodeURIComponent(this._options.custom_css_url)
        : "") +
      (this._options.custom_font_family
        ? "&customFontFamily=" +
          encodeURIComponent(this._options.custom_font_family)
        : "") +
      (this._options.auto_save_delay
        ? "&autoSaveDelay=" +
          encodeURIComponent(String(this._options.auto_save_delay))
        : "") +
      "&debug=" +
      encodeURIComponent(String(this._options.debug)) +
      (this._options.snapshot_url
        ? "&snapshotUrl=" + encodeURIComponent(this._options.snapshot_url)
        : "") +
      (this._options.timezone
        ? "&timezone=" + encodeURIComponent(this._options.timezone)
        : "") +
      (this._options.study_count_limit
        ? "&studyCountLimit=" +
          encodeURIComponent(String(this._options.study_count_limit))
        : "") +
      (this._options.symbol_search_request_delay
        ? "&ssreqdelay=" +
          encodeURIComponent(String(this._options.symbol_search_request_delay))
        : "") +
      (this._options.compare_symbols
        ? "&compareSymbols=" +
          encodeURIComponent(JSON.stringify(this._options.compare_symbols))
        : "") +
      (this._options.theme
        ? "&theme=" + encodeURIComponent(String(this._options.theme))
        : "") +
      (this._options.header_widget_buttons_mode
        ? "&header_widget_buttons_mode=" +
          encodeURIComponent(String(this._options.header_widget_buttons_mode))
        : "") +
      (this._options.time_scale
        ? "&time_scale=" +
          encodeURIComponent(JSON.stringify(this._options.time_scale))
        : "");
    return (
      '<iframe id="' +
      this._id +
      '" name="' +
      this._id +
      '"  src="' +
      t +
      '"' +
      (this._options.autosize || this._options.fullscreen
        ? ""
        : ' width="' +
          this._options.width +
          '" height="' +
          this._options.height +
          '"') +
      ' title="Financial Chart" frameborder="0" allowTransparency="true" scrolling="no" allowfullscreen style="display:block;"></iframe>'
    );
  }
};
(window.TradingView = window.TradingView || {}),
  (window.TradingView.version = o),
  (exports.version = o),
  (exports.widget = s);
