--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Database; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Database" (
    id integer NOT NULL,
    "PA classification" text,
    "Sector/Area" text,
    "Sub-Sector" text,
    "Source name" text,
    "Description" text,
    "Type (General DB, specialized, ...)" text,
    "Free/Paid?" text,
    "Geography" text,
    "Regional data" text,
    "Country data" text,
    "Frequency" text,
    "Years" text,
    "Latest year available" text,
    "Forecasts?" text,
    "Latest forecast year avalable" text,
    "Tags" text,
    "Format" text,
    "Expert opinion" text,
    "Submitter_email" text,
    "Submitter_role" text,
    "Status" text,
    "Reliability Score (1-10)" integer,
    "Link" text
);


ALTER TABLE public."Database" OWNER TO postgres;

--
-- Name: Database_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Database_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Database_id_seq" OWNER TO postgres;

--
-- Name: Database_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Database_id_seq" OWNED BY public."Database".id;


--
-- Name: feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feedback (
    id integer NOT NULL,
    feedback text NOT NULL,
    "time" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.feedback OWNER TO postgres;

--
-- Name: feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.feedback_id_seq OWNER TO postgres;

--
-- Name: feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.feedback_id_seq OWNED BY public.feedback.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    role text,
    expert_domain text DEFAULT 'None'::text,
    CONSTRAINT users_expert_domain_check CHECK ((expert_domain = ANY (ARRAY['Yes'::text, 'None'::text]))),
    CONSTRAINT users_role_check CHECK ((role = ANY (ARRAY['admin'::text, 'contributor'::text])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: Database id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Database" ALTER COLUMN id SET DEFAULT nextval('public."Database_id_seq"'::regclass);


--
-- Name: feedback id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback ALTER COLUMN id SET DEFAULT nextval('public.feedback_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: Database; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Database" (id, "PA classification", "Sector/Area", "Sub-Sector", "Source name", "Description", "Type (General DB, specialized, ...)", "Free/Paid?", "Geography", "Regional data", "Country data", "Frequency", "Years", "Latest year available", "Forecasts?", "Latest forecast year avalable", "Tags", "Format", "Expert opinion", "Submitter_email", "Submitter_role", "Status", "Reliability Score (1-10)", "Link") FROM stdin;
2	PS 	Macroeconomics; Economics; National accounts 	SMEs	MSME Finance Gap 	The MSME finance gap offers statistics on number of micro, small and medium enterprises as well as the number of Formal Enterprises by Level of Financial Constraint. 	\N	Free 	Global	No	Yes	\N	1999; 2000; 2001; 2002; 2003; 2004; 2005; 2006; 2007; 2008; 2009; 2010; 2011; 2012; 2013; 2014; 2015; 2016; 2017; 2018; 2019; 2020; 2021; 2022; 2023	2018; 2019	\N	\N	MSME; SME; Small Medium Enterprises; Small enterprises; medium enterprises; micro enterprises 	Excel 	\N	hamza.boudallaa@infomineo.com	Admin	approved	\N	https://www.smefinanceforum.org/data-sites/msme-finance-gap
3	INS 	Financial Institutions 	Insurance	EIOPA	EIOPA new insurance statistics are based on Solvency II regular reporting information from insurance undertakings and groups in the European Union and the European Economic Area (EEA). These statistics provide the most up to-date and comprehensive picture of the European insurance sector, including country breakdowns and distributions of key variables, allowing for the comparability of high-quality data.  	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	hamza.boudallaa@infomineo.com	Admin	approved	\N	https://www.smefinanceforum.org/data-sites/msme-finance-gap
4	IG	Mining 	Mining 	USGS Minerals Yearbook	Annual reviews are designed to provide timely statistical data on mineral commodities in various countries. Each report includes sections on government policies and programs, environmental issues, trade and production data, industry structure and ownership, commodity sector developments, infrastructure, and a summary outlook.	\N	Free 	Global	No	Yes 	\N	2016; 2017; 2018; 2019; 2020; 2021; 2022; 2023; 2024	 - 	\N	\N	Minerals; mining; cobalt; tin; coal; mineral exports; mineral export; mining export; mining exports; metals; bauxite; alumina; iron ore; diamond; mineral reserve; mineral resources; mineral reserves; natural gas; gold; silver 	Excel ; PDF	\N	hamza.boudallaa@infomineo.com	Admin	approved	\N	https://www.usgs.gov/centers/national-minerals-information-center/international-minerals-statistics-and-information
5	TMT 	Innovation 	Patent 	EPO (Patents) 	Provides data on patent applications filed with the EPO as well as granted patents following country and sector split 	\N	Free 	Europe 	Yes 	Yes 	\N	 - 	2014; 2015; 2016; 2017; 2018; 2019; 2020; 2021; 2022; 2023	\N	\N	Patents; filed patents; granted patents 	Excel; PDF 	\N	hamza.boudallaa@infomineo.com	Admin	approved	\N	https://www.epo.org/en/about-us/statistics/data-download
6	PS 	Macroeconomics 	Wealth	World Inequality Database 	The World Inequality Database (WID) aims to provide open and convenient access to the most extensive available database on the historical evolution of the world distribution of income and wealth, both within countries and between countries.	\N	Free 	Global	Yes 	Yes 	\N	2014; 2015; 2016; 2017; 2018; 2019; 2020; 2021; 2022; 2023	Since 1800	\N	\N	Average income; income inequality; average wealth; Wealth Inequality; wealth income ratio; Carbon inequality; carbon emitters\r\nGender inequality; Female labor income share	Excel 	\N	hamza.boudallaa@infomineo.com	Admin	approved	\N	https://wid.world/data/
8	PS 	Macroeconomics; Economics; National accounts 	Business Statistics 	Eurostat Structural Business Statistics 	Offers data on enterprises number by sector (NACE Rev. 2 activity) 	\N	Free 	European Union; Europe 	Yes 	Yes 	\N	Since 1950	2021; 2022	\N	\N	Number of companies; companies number; number of companies by size class; businesses by sector 	Excel 	\N	hamza.boudallaa@infomineo.com	Admin	approved	\N	https://ec.europa.eu/eurostat/web/structural-business-statistics/database
9	IG	Agriculture	Agriculture	USDA Production, Supply & Distribution 	Provides production, imports, total supply, domestic consumption, exports, withdrawal from market for a large number of commodities	\N	Free 	Global	No	Yes 	\N	2021; 2022	Since 1960	\N	\N	Animal; cotton; coffee; dairy; butter; cattle; swine; almond; almonds; barley; sugar; wheat; rye; pistachios; poultry; peaches; oranges; soybean; sunflower seed; rapeseed; cottonseed; peanut; oilseed; olive oil; peanut oil; meal; millet; chicken; lemons; lemon; limes; milk; cheese; grapes; Agriculture production; Agriculture exports; 	Excel 	\N	hamza.boudallaa@infomineo.com	Admin	approved	\N	https://apps.fas.usda.gov/psdonline/app/index.html#/app/advQuery
10	GA	Macroeconomics; Economics; National accounts 	Business Statistics 	The WB Enterprise Surveys 	The World Bank Enterprise Surveys offer an expansive array of economic data on more than 219,000 firms in 159 economies. Over 350 WBES, 12 Informal Sector Enterprise Surveys in 38 cities, Micro-Enterprise surveys, other surveys, and cross-economy databases in the data portal. The focus is mainly on business obstacles around the around on key questions relevant to tax, corruption, infrastructure..;etc.. 	\N	Free 	Global	No	Yes 	\N	Since 1960	 - 	\N	\N	business obstacles; company barriers; business barriers;  business activity;  Management practices index; informal firms; female participation; Bribery incidence; female ownership; 	Excel 	\N	hamza.boudallaa@infomineo.com	Admin	approved	\N	https://www.enterprisesurveys.org/en/data/exploreeconomies/2020/belgium#2
11	FI 	Financial Institutions 	Asset management	EFAMA	EFAMA monthly and quarterly statistical releases provide detailed information on the latest trends in the European and international fund industry. Provides historic data on assets of regulated open end funds, net assets by type of fund (equity, bond, money market, multi-asset), domiciles of worldwide investment funds assets	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	PDF	\N	hamza.boudallaa@infomineo.com	Admin	approved	\N	https://www.efama.org/previous-monthly-and-quarterly-statistics
12	IG 	Aerospace 	Aerospace	Aerospace - International Astronaut Database 	Yearly number of astronauts launched in space by gender, and list of missions with names onboard and total flight time 	\N	Free 	Global	 - 	Yes 	\N	2020; 2021; 2022; 2023; 2024 	Since 1960	\N	\N	Astronauts; number of astronauts; 	Extractable table 	\N	hamza.boudallaa@infomineo.com	Admin	approved	\N	https://aerospace.csis.org/data/international-astronaut-database/
7	PS	Demographics 	Geospatial data 	Africapolis 	Africapolis offers a standardized and geospatial database on urbanization in Africa, covering all 54 countries with data from 2015. It includes 7,496 small towns and intermediary cities, based on a large inventory of housing and population censuses, electoral registers, and satellite images to address data gaps. Developed by e-Geopolis and the OECD Sahel and West Africa Club, Africapolis aims to support urban planning and sustainability efforts across the continent.	\N	Free 	Africa 	No	Yes 	\N	Since 1800	Since 1950	\N	\N	Geospatial map; Metropolitan population; urban population; Africa map; agglomeration population; 	Map; Excel 	second test	hamza.boudallaa@infomineo.com	Admin	approved	\N	https://africapolis.org/en/data?country=Angola&keyfigure=totalPop&type=abs&year=2015
13	PS	Legal services 	Law firms 	The Global 200 Headcount	Provides data on headcounts of top 200 law firms 	\N	Free 	Global	 - 	 - 	\N	Since 1960	2022	\N	\N	Law firms; top law firms; law firm employees; law firm headcount 	Tableau 	\N	oussama.stouky@infomineo.com	Admin	approved	\N	https://public.tableau.com/app/profile/jin5995/viz/TheGlobal200Headcount/G200Headcount
14	TMT 	ICT 	ICT 	ITU 	As the UN specialized agency for ICTs, ITU is the official source for global ICT statistics. The WTID includes statistics for more than 200 economies for more than 180 indicators(see list of indicators). Since ITU relies primarily on official data provided by countries, the availability of data for the different countries, indicators and years varies.  	\N	Free 	Global	No	Yes 	\N	2022	2005; 2006; 2007; 2008; 2009; 2010; 2011; 2012; 2013; 2014; 2015; 2016; 2017; 2018; 2019; 2020; 2021; 2022; 2023	\N	\N	Fixed telephone subscriptions; mobile-telephone subscriptions; \r\nFixed ?broadband subscriptions; mobile broadband subscriptions; mobile phone coverage; internet coverage, internet penetration; phone penetration; rural internet penetration; urban internet penetration 	Excel 	\N	oussama.stouky@infomineo.com	Admin	approved	\N	https://www.itu.int/en/ITU-D/Statistics/Pages/stat/default.aspx
15	TMT	ICT 	ICT 	Digital Africa 	Report contains all the latest data, insights, and trends you need to help you understand how people in Africa use digital devices and services. 	\N	Free 	Africa 	Yes 	Yes 	\N	2005; 2006; 2007; 2008; 2009; 2010; 2011; 2012; 2013; 2014; 2015; 2016; 2017; 2018; 2019; 2020; 2021; 2022; 2023	2011; 2012; 2013; 2014; 2015; 2016; 2017; 2018; 2019; 2020; 2021; 2022; 2023; 2024 	\N	\N	Internet penetration; smartphone penetration; ecommerce penetration; e-commerce penetration; Internet use; Internet connection speed social media use; Facebook users; WhatsApp users;  YouTube users; mobile connection; 	PDF	\N	oussama.stouky@infomineo.com	Admin	approved	\N	https://datareportal.com/reports/tag/Africa
16	IG 	Mining 	Steel	World Steel Assoc - Top producers 	Ranking of the 50 top steel-producing companies. This list is updated in early June every year.	\N	Free 	Global	- 	- 	\N	2011; 2012; 2013; 2014; 2015; 2016; 2017; 2018; 2019; 2020; 2021; 2022; 2023; 2024 	2022; 2023	\N	\N	Top steel producer: steel companies; largest steel producer; largest steel manufacturers; largest steel producers; largest steel manufacturer	Extractable table ; PDF	\N	oussama.stouky@infomineo.com	Admin	approved	\N	https://worldsteel.org/data/top-producers/
17	IG	Mining 	Steel	World Steel Assoc - Annual Data 	Total production of steel by country 	\N	Free 	Global	Yes 	Yes 	\N	2022; 2023	2019; 2020; 2021; 2022; 2023 	\N	\N	Steel production; steel producer: largest steel producer 	Extractable table ; PDF	\N	oussama.stouky@infomineo.com	Admin	approved	\N	https://worldsteel.org/data/annual-production-steel-data/?ind=P1_crude_steel_total_pub/CHN/IND
18	IG	Aerospace 	Commercial Airlines	Oliver Wyman - Global Fleet and MRO Market Forecast 2023-2033	Oliver Wyman Global Fleet and MRO Market Forecast 2023-2033 assesses the 10-year outlook for the commercial airline transport fleet and the associated maintenance, repair, and overhaul (MRO) market. 	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	PDF	\N	oussama.stouky@infomineo.com	Admin	approved	\N	https://www.oliverwyman.com/content/dam/oliver-wyman/v2/publications/2023/feb/Fleet-and-MRO-Forecast-2023-2033.pdf
19	IG	Aerospace 	Commercial Airlines	Airbus - Global Market Forecast	Airbus latest 20 year Global Market Forecast (GMF) for the 2024-2043 period offers a forward-looking view of air traffic and fleet evolutions. GMF 2024-2043 connects short and long term trends, reflecting dynamic future traffic evolution particularly in regions showing significant pent-up demand, notably Asia Pacific. 	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Excel; PDF	\N	oussama.stouky@infomineo.com	Admin	approved	\N	https://www.airbus.com/en/products-services/commercial-aircraft/global-market-forecast
20	IG	Aerospace 	Commercial Airlines	Boeing - Commercial Market Forecast	\N	\N	Free 	Global	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	oussama.stouky@infomineo.com	Admin	approved	\N	https://www.boeing.com/commercial/market/commercial-market-outlook#cmo-app
21	IG	Aerospace 	Air Cargo	Boeing - World Air Cargo Forecast	\N	\N	Free 	Global	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	oussama.stouky@infomineo.com	Admin	approved	\N	https://www.boeing.com/commercial/market/cargo-forecast
22	IG	Aerospace 	Aircraft Finance	Boeing - Commercial aircraft finance market outlook	\N	\N	Free 	Global	\N	\N	\N	\N	2018; 2019; 2020: 2021; 2022; 2023	\N	\N	\N	\N	\N	oussama.stouky@infomineo.com	Admin	approved	\N	https://www.boeing.com/commercial/market/current-aircraft-financing-market
23	IG	Aerospace 	Human Resources	Boeing - Pilot and Technician Outlook	This forecast is limited to the commercial aviation sector, which includes commercial passenger and commercial freight.	\N	Free 	Global	\N	\N	\N	\N	-	Yes	2024; 2025; 2026; 2027; 2028; 2029; 2030; 2031; 2032; 2033; 2034; 2035; 2036; 2037; 2038; 2039; 2040; 2041; 2042; 2043	\N	PDF; Tableau		oussama.stouky@infomineo.com	Admin	approved	\N	https://www.boeing.com/commercial/market/pilot-technician-outlook
24	IG	Aerospace 	Services	Boeing - Commercial Services Market Outlook	The Boeing Commercial Services Market Outlook (SMO) covers the support and services functions commonly found in the aviation market today. The SMO is a 20-year forecast, serving to guide business planning as well as to share with the public our view of industry trends in the commercial market. Boeing models for projecting the size of services markets are analytically linked to the proprietary models we use in forecasting world airline fleet and government budgets. They also are linked to independent assessments of the forces driving specific markets.	\N	Free 	Global	Yes	No	\N	\N	-	Yes	2024; 2025; 2026; 2027; 2028; 2029; 2030; 2031; 2032; 2033; 2034; 2035; 2036; 2037; 2038; 2039; 2040; 2041; 2042; 2043	\N	PDF; Tableau		oussama.stouky@infomineo.com	Admin	approved	\N	https://www.boeing.com/commercial/market/services-market-outlook
1	IG	Manufacturing	Automotive production	OICA Global Production Statistics 	Provides data on production  of cars, including both passengers and commercial vehicles 	\N	Free 	Global	Yes	Yes	\N	2019; 2020; 2021; 2022; 2023	1999; 2000; 2001; 2002; 2003; 2004; 2005; 2006; 2007; 2008; 2009; 2010; 2011; 2012; 2013; 2014; 2015; 2016; 2017; 2018; 2019; 2020; 2021; 2022; 2023	\N	\N	Cars; Automotive; Auto; Car; Vehicle; car production; auto production; passenger car; commercial car; passenger auto; commercial auto; vehicle production;	Excel 	FIRST	hamza.boudallaa@infomineo.com	Admin	approved	\N	https://www.oica.net/production-statistics/
\.


--
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.feedback (id, feedback, "time") FROM stdin;
1	good	2025-04-07 00:20:56.383824
2	User friendly app	2025-04-07 09:34:50.11235
3	I like the application	2025-04-08 15:53:50.006569
4	It saves time	2025-04-10 13:24:14.63247
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, role, expert_domain) FROM stdin;
1	oussama.stouky@infomineo.com	admin	Yes
2	hamza.boudallaa@infomineo.com	admin	Yes
4	souleiman.oulmaati@infomineo.com	admin	Yes
3	youssef.moutaouakkil@infomineo.com	admin	Yes
\.


--
-- Name: Database_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Database_id_seq"', 24, true);


--
-- Name: feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.feedback_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: Database Database_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Database"
    ADD CONSTRAINT "Database_pkey" PRIMARY KEY (id);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

