--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3 (Ubuntu 14.3-1.pgdg20.04+1)
-- Dumped by pg_dump version 14.3 (Ubuntu 14.3-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: perguntas; Type: TABLE; Schema: public; Owner: mateus
--

CREATE TABLE public.perguntas (
    id integer NOT NULL,
    pergunta character varying(200),
    id_resposta integer
);


ALTER TABLE public.perguntas OWNER TO mateus;

--
-- Name: perguntas_id_seq; Type: SEQUENCE; Schema: public; Owner: mateus
--

CREATE SEQUENCE public.perguntas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.perguntas_id_seq OWNER TO mateus;

--
-- Name: perguntas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mateus
--

ALTER SEQUENCE public.perguntas_id_seq OWNED BY public.perguntas.id;


--
-- Name: resposta; Type: TABLE; Schema: public; Owner: mateus
--

CREATE TABLE public.resposta (
    id integer NOT NULL,
    resposta character varying(200) NOT NULL
);


ALTER TABLE public.resposta OWNER TO mateus;

--
-- Name: resposta_id_seq; Type: SEQUENCE; Schema: public; Owner: mateus
--

CREATE SEQUENCE public.resposta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.resposta_id_seq OWNER TO mateus;

--
-- Name: resposta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mateus
--

ALTER SEQUENCE public.resposta_id_seq OWNED BY public.resposta.id;


--
-- Name: statement; Type: TABLE; Schema: public; Owner: mateus
--

CREATE TABLE public.statement (
    id integer NOT NULL,
    text character varying(255),
    search_text character varying(255) DEFAULT ''::character varying NOT NULL,
    conversation character varying(32) DEFAULT ''::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    in_response_to character varying(255),
    search_in_response_to character varying(255) DEFAULT ''::character varying NOT NULL,
    persona character varying(50) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE public.statement OWNER TO mateus;

--
-- Name: statement_id_seq; Type: SEQUENCE; Schema: public; Owner: mateus
--

CREATE SEQUENCE public.statement_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.statement_id_seq OWNER TO mateus;

--
-- Name: statement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mateus
--

ALTER SEQUENCE public.statement_id_seq OWNED BY public.statement.id;


--
-- Name: tag; Type: TABLE; Schema: public; Owner: mateus
--

CREATE TABLE public.tag (
    id integer NOT NULL,
    name character varying(50)
);


ALTER TABLE public.tag OWNER TO mateus;

--
-- Name: tag_association; Type: TABLE; Schema: public; Owner: mateus
--

CREATE TABLE public.tag_association (
    tag_id integer,
    statement_id integer
);


ALTER TABLE public.tag_association OWNER TO mateus;

--
-- Name: tag_id_seq; Type: SEQUENCE; Schema: public; Owner: mateus
--

CREATE SEQUENCE public.tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tag_id_seq OWNER TO mateus;

--
-- Name: tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mateus
--

ALTER SEQUENCE public.tag_id_seq OWNED BY public.tag.id;


--
-- Name: perguntas id; Type: DEFAULT; Schema: public; Owner: mateus
--

ALTER TABLE ONLY public.perguntas ALTER COLUMN id SET DEFAULT nextval('public.perguntas_id_seq'::regclass);


--
-- Name: resposta id; Type: DEFAULT; Schema: public; Owner: mateus
--

ALTER TABLE ONLY public.resposta ALTER COLUMN id SET DEFAULT nextval('public.resposta_id_seq'::regclass);


--
-- Name: statement id; Type: DEFAULT; Schema: public; Owner: mateus
--

ALTER TABLE ONLY public.statement ALTER COLUMN id SET DEFAULT nextval('public.statement_id_seq'::regclass);


--
-- Name: tag id; Type: DEFAULT; Schema: public; Owner: mateus
--

ALTER TABLE ONLY public.tag ALTER COLUMN id SET DEFAULT nextval('public.tag_id_seq'::regclass);


--
-- Data for Name: perguntas; Type: TABLE DATA; Schema: public; Owner: mateus
--

COPY public.perguntas (id, pergunta, id_resposta) FROM stdin;
1	oi	2
2	qual o seu nome?	3
3	me manda uma imagem	4
4	me manda um pdf	5
5	me manda um link	6
\.


--
-- Data for Name: resposta; Type: TABLE DATA; Schema: public; Owner: mateus
--

COPY public.resposta (id, resposta) FROM stdin;
2	Olá
3	ainda não sei, me ajuda a escolher um nome:)
4	<WhatsApp Image 2022-05-20 at 20.39.31.jpeg>
5	$EDITAL N°01_2022-GIPAR.pdf$
6	!http://localhost:3000/upload#!
\.


--
-- Data for Name: statement; Type: TABLE DATA; Schema: public; Owner: mateus
--

COPY public.statement (id, text, search_text, conversation, created_at, in_response_to, search_in_response_to, persona) FROM stdin;
1	oi	oi	training	2022-06-14 22:18:53.778158-03	\N		
2	Olá	olá	training	2022-06-14 22:18:53.800165-03	oi	oi	
3	qual o seu nome?	ADJ:o NOUN:seu NOUN:nome	training	2022-06-14 22:18:53.937636-03	\N		
4	ainda não sei, me ajuda a escolher um nome:)	NOUN:não NOUN:sei NOUN:ajuda VERB:escolher NOUN:um INTJ:nome	training	2022-06-14 22:18:53.960522-03	qual o seu nome?	ADJ:o NOUN:seu NOUN:nome	
5	me manda uma imagem	VERB:uma ADJ:imagem	training	2022-06-14 22:18:54.02606-03	\N		
6	<WhatsApp Image 2022-05-20 at 20.39.31.jpeg>	PROPN:image	training	2022-06-14 22:18:54.042585-03	me manda uma imagem	VERB:uma ADJ:imagem	
7	me manda um pdf	VERB:um INTJ:pdf	training	2022-06-14 22:18:54.09382-03	\N		
8	$EDITAL N°01_2022-GIPAR.pdf$	PROPN:n	training	2022-06-14 22:18:54.099757-03	me manda um pdf	VERB:um INTJ:pdf	
9	me manda um link	VERB:um INTJ:link	training	2022-06-14 22:18:54.130807-03	\N		
10	!http://localhost:3000/upload#!	! http://localhost:3000/upload # !	training	2022-06-14 22:18:54.137926-03	me manda um link	VERB:um INTJ:link	
11	oi	oi		2022-06-14 22:19:22.901119-03	\N		
12	Olá			2022-06-14 22:19:23.092468-03	oi		bot:Robo
13	qual o seu nome?	ADJ:o NOUN:seu NOUN:nome		2022-06-14 22:19:39.951984-03	oi		
14	ainda não sei, me ajuda a escolher um nome:)			2022-06-14 22:19:40.015568-03	qual o seu nome?		bot:Robo
15	me manda uma imagem	VERB:uma ADJ:imagem		2022-06-14 22:19:54.901497-03	qual o seu nome?		
16	<WhatsApp Image 2022-05-20 at 20.39.31.jpeg>			2022-06-14 22:19:54.945353-03	me manda uma imagem		bot:Robo
17	oi	oi		2022-06-14 22:26:45.386122-03	me manda uma imagem		
18	Olá			2022-06-14 22:26:45.435795-03	oi		bot:Robo
19	me manda um pdf	VERB:um INTJ:pdf		2022-06-14 22:26:49.857855-03	oi		
20	$EDITAL N°01_2022-GIPAR.pdf$			2022-06-14 22:26:49.928024-03	me manda um pdf		bot:Robo
21	me manda um link	VERB:um INTJ:link		2022-06-14 22:27:05.677035-03	me manda um pdf		
22	!http://localhost:3000/upload#!			2022-06-14 22:27:05.754104-03	me manda um link		bot:Robo
23	me manda uma imagem	VERB:uma ADJ:imagem		2022-06-14 22:27:19.223079-03	me manda um link		
24	<WhatsApp Image 2022-05-20 at 20.39.31.jpeg>			2022-06-14 22:27:19.308712-03	me manda uma imagem		bot:Robo
25	oi	oi		2022-06-14 22:34:53.96915-03	me manda uma imagem		
26	Olá			2022-06-14 22:34:54.027414-03	oi		bot:Robo
27	me manda um pdf	VERB:um INTJ:pdf		2022-06-14 22:34:58.833496-03	oi		
28	$EDITAL N°01_2022-GIPAR.pdf$			2022-06-14 22:34:59.089244-03	me manda um pdf		bot:Robo
29	me manda um link	VERB:um INTJ:link		2022-06-14 22:35:25.255809-03	me manda um pdf		
30	!http://localhost:3000/upload#!			2022-06-14 22:35:25.342759-03	me manda um link		bot:Robo
31	me manda uma imagem	VERB:uma ADJ:imagem		2022-06-14 22:35:37.1134-03	me manda um link		
32	<WhatsApp Image 2022-05-20 at 20.39.31.jpeg>			2022-06-14 22:35:37.164662-03	me manda uma imagem		bot:Robo
33	oi	oi		2022-06-14 22:38:45.105463-03	me manda uma imagem		
34	Olá			2022-06-14 22:38:45.1693-03	oi		bot:Robo
35	oi	oi		2022-06-14 22:39:01.105809-03	oi		
36	Olá			2022-06-14 22:39:01.164206-03	oi		bot:Robo
37	boa noite	NOUN:noite		2022-06-14 22:39:05.913711-03	oi		
38	Olá			2022-06-14 22:39:06.038112-03	boa noite		bot:Robo
39	qual seu nome	ADJ:seu NOUN:nome		2022-06-14 22:39:11.604116-03	boa noite		
40	ainda não sei, me ajuda a escolher um nome:)			2022-06-14 22:39:11.666872-03	qual seu nome		bot:Robo
41	oi	oi		2022-06-14 22:40:15.669338-03	qual seu nome		
42	oi			2022-06-14 22:40:15.761316-03	oi		bot:Robo
\.


--
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: mateus
--

COPY public.tag (id, name) FROM stdin;
\.


--
-- Data for Name: tag_association; Type: TABLE DATA; Schema: public; Owner: mateus
--

COPY public.tag_association (tag_id, statement_id) FROM stdin;
\.


--
-- Name: perguntas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mateus
--

SELECT pg_catalog.setval('public.perguntas_id_seq', 5, true);


--
-- Name: resposta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mateus
--

SELECT pg_catalog.setval('public.resposta_id_seq', 6, true);


--
-- Name: statement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mateus
--

SELECT pg_catalog.setval('public.statement_id_seq', 42, true);


--
-- Name: tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mateus
--

SELECT pg_catalog.setval('public.tag_id_seq', 1, false);


--
-- Name: resposta resposta_pkey; Type: CONSTRAINT; Schema: public; Owner: mateus
--

ALTER TABLE ONLY public.resposta
    ADD CONSTRAINT resposta_pkey PRIMARY KEY (id);


--
-- Name: statement statement_pkey; Type: CONSTRAINT; Schema: public; Owner: mateus
--

ALTER TABLE ONLY public.statement
    ADD CONSTRAINT statement_pkey PRIMARY KEY (id);


--
-- Name: tag tag_name_key; Type: CONSTRAINT; Schema: public; Owner: mateus
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_name_key UNIQUE (name);


--
-- Name: tag tag_pkey; Type: CONSTRAINT; Schema: public; Owner: mateus
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (id);


--
-- Name: perguntas id_resposta; Type: FK CONSTRAINT; Schema: public; Owner: mateus
--

ALTER TABLE ONLY public.perguntas
    ADD CONSTRAINT id_resposta FOREIGN KEY (id_resposta) REFERENCES public.resposta(id);


--
-- Name: tag_association tag_association_statement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mateus
--

ALTER TABLE ONLY public.tag_association
    ADD CONSTRAINT tag_association_statement_id_fkey FOREIGN KEY (statement_id) REFERENCES public.statement(id);


--
-- Name: tag_association tag_association_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mateus
--

ALTER TABLE ONLY public.tag_association
    ADD CONSTRAINT tag_association_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tag(id);


--
-- PostgreSQL database dump complete
--

