--
-- PostgreSQL database dump
--

\restrict 6xIhQFMElnq6xZvm77FA0SKY9znZotMnH7KQbccRNlMJIVQ7jlcespgiRHoutGY

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-07-23 15:33:53

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

--
-- TOC entry 905 (class 1247 OID 17068)
-- Name: estado_pago; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_pago AS ENUM (
    'pendiente',
    'completado',
    'reembolsado'
);


ALTER TYPE public.estado_pago OWNER TO postgres;

--
-- TOC entry 896 (class 1247 OID 17014)
-- Name: estado_servicio; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_servicio AS ENUM (
    'pendiente',
    'en_proceso',
    'finalizado',
    'cancelado'
);


ALTER TYPE public.estado_servicio OWNER TO postgres;

--
-- TOC entry 902 (class 1247 OID 17060)
-- Name: metodo_pago; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.metodo_pago AS ENUM (
    'efectivo',
    'transferencia',
    'terminal'
);


ALTER TYPE public.metodo_pago OWNER TO postgres;

--
-- TOC entry 878 (class 1247 OID 16918)
-- Name: rol_usuario; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.rol_usuario AS ENUM (
    'admin',
    'cliente',
    'lavador'
);


ALTER TYPE public.rol_usuario OWNER TO postgres;

--
-- TOC entry 932 (class 1247 OID 17198)
-- Name: tipo_notificacion; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_notificacion AS ENUM (
    'recordatorio_preventivo',
    'alerta_promocion',
    'estado_servicio'
);


ALTER TYPE public.tipo_notificacion OWNER TO postgres;

--
-- TOC entry 245 (class 1255 OID 17157)
-- Name: es_lavador_valido(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.es_lavador_valido(usuario_id integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Si es NULL (porque el servicio está pendiente y nadie lo ha tomado), es válido
    IF usuario_id IS NULL THEN
        RETURN TRUE;
    END IF;
    
    -- Verifica que el usuario exista, sea lavador y esté activo
    RETURN EXISTS (
        SELECT 1 FROM usuarios 
        WHERE id = usuario_id AND rol = 'lavador' AND activo = TRUE
    );
END;
$$;


ALTER FUNCTION public.es_lavador_valido(usuario_id integer) OWNER TO postgres;

--
-- TOC entry 244 (class 1255 OID 17137)
-- Name: log_cambio_estado_servicio(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_cambio_estado_servicio() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO historial_estados_servicios(servicio_id, estado_anterior, estado_nuevo)
        VALUES (NEW.id, NULL, NEW.state);
    ELSIF (TG_OP = 'UPDATE' AND OLD.estado IS DISTINCT FROM NEW.estado) THEN
        INSERT INTO historial_estados_servicios(servicio_id, estado_anterior, estado_nuevo)
        VALUES (NEW.id, OLD.estado, NEW.estado);
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.log_cambio_estado_servicio() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 233 (class 1259 OID 17096)
-- Name: feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feedback (
    id integer NOT NULL,
    servicio_id integer NOT NULL,
    calificacion integer,
    comentario text,
    es_negativo boolean DEFAULT false,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT feedback_calificacion_check CHECK (((calificacion >= 1) AND (calificacion <= 5)))
);


ALTER TABLE public.feedback OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 17095)
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
-- TOC entry 5202 (class 0 OID 0)
-- Dependencies: 232
-- Name: feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.feedback_id_seq OWNED BY public.feedback.id;


--
-- TOC entry 235 (class 1259 OID 17117)
-- Name: historial_estados_servicios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_estados_servicios (
    id integer NOT NULL,
    servicio_id integer NOT NULL,
    estado_anterior public.estado_servicio,
    estado_nuevo public.estado_servicio NOT NULL,
    fecha_cambio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    usuario_id integer
);


ALTER TABLE public.historial_estados_servicios OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 17116)
-- Name: historial_estados_servicios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_estados_servicios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_estados_servicios_id_seq OWNER TO postgres;

--
-- TOC entry 5203 (class 0 OID 0)
-- Dependencies: 234
-- Name: historial_estados_servicios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_estados_servicios_id_seq OWNED BY public.historial_estados_servicios.id;


--
-- TOC entry 243 (class 1259 OID 17206)
-- Name: notificaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notificaciones (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    tipo public.tipo_notificacion DEFAULT 'recordatorio_preventivo'::public.tipo_notificacion NOT NULL,
    titulo character varying(100) NOT NULL,
    mensaje text NOT NULL,
    leido boolean DEFAULT false,
    fecha_envio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura timestamp without time zone
);


ALTER TABLE public.notificaciones OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 17205)
-- Name: notificaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notificaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notificaciones_id_seq OWNER TO postgres;

--
-- TOC entry 5204 (class 0 OID 0)
-- Dependencies: 242
-- Name: notificaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notificaciones_id_seq OWNED BY public.notificaciones.id;


--
-- TOC entry 231 (class 1259 OID 17076)
-- Name: pagos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagos (
    id integer NOT NULL,
    servicio_id integer NOT NULL,
    metodo public.metodo_pago NOT NULL,
    estado public.estado_pago DEFAULT 'completado'::public.estado_pago NOT NULL,
    monto_pagado numeric(10,2) NOT NULL,
    fecha_pago timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pagos_monto_pagado_check CHECK ((monto_pagado >= (0)::numeric))
);


ALTER TABLE public.pagos OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 17075)
-- Name: pagos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pagos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pagos_id_seq OWNER TO postgres;

--
-- TOC entry 5205 (class 0 OID 0)
-- Dependencies: 230
-- Name: pagos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pagos_id_seq OWNED BY public.pagos.id;


--
-- TOC entry 225 (class 1259 OID 16976)
-- Name: paquetes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paquetes (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    duracion_minutos integer DEFAULT 30 NOT NULL,
    activo boolean DEFAULT true,
    precio_base numeric(10,2) DEFAULT 0.00 NOT NULL,
    CONSTRAINT paquetes_precio_base_check CHECK ((precio_base >= (0)::numeric))
);


ALTER TABLE public.paquetes OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16975)
-- Name: paquetes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.paquetes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.paquetes_id_seq OWNER TO postgres;

--
-- TOC entry 5206 (class 0 OID 0)
-- Dependencies: 224
-- Name: paquetes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.paquetes_id_seq OWNED BY public.paquetes.id;


--
-- TOC entry 227 (class 1259 OID 16990)
-- Name: precios_paquetes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.precios_paquetes (
    id integer NOT NULL,
    paquete_id integer NOT NULL,
    tipo_id integer NOT NULL,
    precio numeric(10,2) NOT NULL,
    CONSTRAINT precios_paquetes_precio_check CHECK ((precio >= (0)::numeric))
);


ALTER TABLE public.precios_paquetes OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16989)
-- Name: precios_paquetes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.precios_paquetes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.precios_paquetes_id_seq OWNER TO postgres;

--
-- TOC entry 5207 (class 0 OID 0)
-- Dependencies: 226
-- Name: precios_paquetes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.precios_paquetes_id_seq OWNED BY public.precios_paquetes.id;


--
-- TOC entry 241 (class 1259 OID 17177)
-- Name: promociones_aplicadas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promociones_aplicadas (
    servicio_id integer NOT NULL,
    promocion_id integer NOT NULL,
    descuento_ahorrado numeric(10,2) NOT NULL,
    fecha_aplicacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT promociones_aplicadas_descuento_ahorrado_check CHECK ((descuento_ahorrado >= (0)::numeric))
);


ALTER TABLE public.promociones_aplicadas OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 17160)
-- Name: promociones_temporales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promociones_temporales (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    porcentaje_descuento numeric(5,2) DEFAULT 0.00 NOT NULL,
    fecha_inicio timestamp without time zone NOT NULL,
    fecha_fin timestamp without time zone NOT NULL,
    activo boolean DEFAULT true,
    CONSTRAINT chk_fechas_promocion CHECK ((fecha_fin > fecha_inicio)),
    CONSTRAINT promociones_temporales_porcentaje_descuento_check CHECK (((porcentaje_descuento >= (0)::numeric) AND (porcentaje_descuento <= (100)::numeric)))
);


ALTER TABLE public.promociones_temporales OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 17159)
-- Name: promociones_temporales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.promociones_temporales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.promociones_temporales_id_seq OWNER TO postgres;

--
-- TOC entry 5208 (class 0 OID 0)
-- Dependencies: 239
-- Name: promociones_temporales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.promociones_temporales_id_seq OWNED BY public.promociones_temporales.id;


--
-- TOC entry 229 (class 1259 OID 17024)
-- Name: servicios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servicios (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    lavador_id integer,
    vehiculo_placa character varying(20) NOT NULL,
    paquete_id integer NOT NULL,
    estado public.estado_servicio DEFAULT 'pendiente'::public.estado_servicio,
    monto_total numeric(10,2) NOT NULL,
    descuento_aplicado boolean DEFAULT false,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_inicio timestamp without time zone,
    fecha_finalizacion timestamp without time zone,
    CONSTRAINT chk_solo_lavadores_activos CHECK (public.es_lavador_valido(lavador_id)),
    CONSTRAINT servicios_monto_total_check CHECK ((monto_total >= (0)::numeric))
);


ALTER TABLE public.servicios OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 17023)
-- Name: servicios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.servicios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.servicios_id_seq OWNER TO postgres;

--
-- TOC entry 5209 (class 0 OID 0)
-- Dependencies: 228
-- Name: servicios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.servicios_id_seq OWNED BY public.servicios.id;


--
-- TOC entry 222 (class 1259 OID 16945)
-- Name: tipos_vehiculo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipos_vehiculo (
    id integer NOT NULL,
    nombre_tipo character varying(50) NOT NULL
);


ALTER TABLE public.tipos_vehiculo OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16944)
-- Name: tipos_vehiculo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipos_vehiculo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipos_vehiculo_id_seq OWNER TO postgres;

--
-- TOC entry 5210 (class 0 OID 0)
-- Dependencies: 221
-- Name: tipos_vehiculo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipos_vehiculo_id_seq OWNED BY public.tipos_vehiculo.id;


--
-- TOC entry 220 (class 1259 OID 16926)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255) NOT NULL,
    telefono character varying(20),
    rol public.rol_usuario DEFAULT 'cliente'::public.rol_usuario NOT NULL,
    activo boolean DEFAULT true,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16925)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5211 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 223 (class 1259 OID 16955)
-- Name: vehiculos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehiculos (
    placa character varying(20) NOT NULL,
    marca character varying(50) NOT NULL,
    modelo character varying(50) NOT NULL,
    color character varying(30),
    tipo_id integer NOT NULL,
    cliente_id integer NOT NULL
);


ALTER TABLE public.vehiculos OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 17144)
-- Name: vista_estadisticas_autolavado; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_estadisticas_autolavado AS
 SELECT count(DISTINCT s.id) AS total_servicios_historicos,
    count(DISTINCT
        CASE
            WHEN (s.fecha_creacion >= CURRENT_DATE) THEN s.id
            ELSE NULL::integer
        END) AS servicios_hoy,
    COALESCE(sum(
        CASE
            WHEN (p.estado = 'completado'::public.estado_pago) THEN p.monto_pagado
            ELSE (0)::numeric
        END), (0)::numeric) AS ingresos_totales_recaudados,
    (COALESCE(avg(f.calificacion), (0)::numeric))::numeric(10,2) AS calificacion_promedio_negocio,
    count(
        CASE
            WHEN (f.es_negativo = true) THEN 1
            ELSE NULL::integer
        END) AS total_quejas_alertas,
    count(
        CASE
            WHEN (p.metodo = 'efectivo'::public.metodo_pago) THEN 1
            ELSE NULL::integer
        END) AS pagos_efectivo,
    count(
        CASE
            WHEN (p.metodo = 'transferencia'::public.metodo_pago) THEN 1
            ELSE NULL::integer
        END) AS pagos_transferencia,
    count(
        CASE
            WHEN (p.metodo = 'terminal'::public.metodo_pago) THEN 1
            ELSE NULL::integer
        END) AS pagos_terminal
   FROM ((public.servicios s
     LEFT JOIN public.pagos p ON ((s.id = p.servicio_id)))
     LEFT JOIN public.feedback f ON ((s.id = f.servicio_id)));


ALTER VIEW public.vista_estadisticas_autolavado OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 17139)
-- Name: vista_estadisticas_cliente; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_estadisticas_cliente AS
 SELECT u.id AS cliente_id,
    u.nombre AS cliente_nombre,
    count(s.id) AS total_servicios_solicitados,
    count(
        CASE
            WHEN (s.estado = 'finalizado'::public.estado_servicio) THEN 1
            ELSE NULL::integer
        END) AS servicios_completados,
    count(
        CASE
            WHEN (s.estado = 'cancelado'::public.estado_servicio) THEN 1
            ELSE NULL::integer
        END) AS servicios_cancelados,
    COALESCE(sum(
        CASE
            WHEN (s.estado = 'finalizado'::public.estado_servicio) THEN s.monto_total
            ELSE (0)::numeric
        END), (0)::numeric) AS total_gastado,
    (COALESCE(avg(
        CASE
            WHEN (s.estado = 'finalizado'::public.estado_servicio) THEN s.monto_total
            ELSE NULL::numeric
        END), (0)::numeric))::numeric(10,2) AS gasto_promedio_por_lavado,
    max(s.fecha_creacion) AS fecha_ultimo_servicio
   FROM (public.usuarios u
     LEFT JOIN public.servicios s ON ((u.id = s.cliente_id)))
  WHERE (u.rol = 'cliente'::public.rol_usuario)
  GROUP BY u.id, u.nombre;


ALTER VIEW public.vista_estadisticas_cliente OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 17149)
-- Name: vista_rendimiento_lavadores; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_rendimiento_lavadores AS
 SELECT u.id AS lavador_id,
    u.nombre AS lavador_nombre,
    count(s.id) AS servicios_realizados,
    (COALESCE(avg(f.calificacion), (0)::numeric))::numeric(10,2) AS calificacion_promedio,
    (COALESCE(avg((EXTRACT(epoch FROM (s.fecha_finalizacion - s.fecha_inicio)) / (60)::numeric)), (0)::numeric))::integer AS tiempo_promedio_lavado_minutos
   FROM ((public.usuarios u
     LEFT JOIN public.servicios s ON ((u.id = s.lavador_id)))
     LEFT JOIN public.feedback f ON ((s.id = f.servicio_id)))
  WHERE ((u.rol = 'lavador'::public.rol_usuario) AND (s.estado = 'finalizado'::public.estado_servicio))
  GROUP BY u.id, u.nombre;


ALTER VIEW public.vista_rendimiento_lavadores OWNER TO postgres;

--
-- TOC entry 4955 (class 2604 OID 17099)
-- Name: feedback id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback ALTER COLUMN id SET DEFAULT nextval('public.feedback_id_seq'::regclass);


--
-- TOC entry 4958 (class 2604 OID 17120)
-- Name: historial_estados_servicios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estados_servicios ALTER COLUMN id SET DEFAULT nextval('public.historial_estados_servicios_id_seq'::regclass);


--
-- TOC entry 4964 (class 2604 OID 17209)
-- Name: notificaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones ALTER COLUMN id SET DEFAULT nextval('public.notificaciones_id_seq'::regclass);


--
-- TOC entry 4952 (class 2604 OID 17079)
-- Name: pagos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos ALTER COLUMN id SET DEFAULT nextval('public.pagos_id_seq'::regclass);


--
-- TOC entry 4943 (class 2604 OID 16979)
-- Name: paquetes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paquetes ALTER COLUMN id SET DEFAULT nextval('public.paquetes_id_seq'::regclass);


--
-- TOC entry 4947 (class 2604 OID 16993)
-- Name: precios_paquetes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.precios_paquetes ALTER COLUMN id SET DEFAULT nextval('public.precios_paquetes_id_seq'::regclass);


--
-- TOC entry 4960 (class 2604 OID 17163)
-- Name: promociones_temporales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promociones_temporales ALTER COLUMN id SET DEFAULT nextval('public.promociones_temporales_id_seq'::regclass);


--
-- TOC entry 4948 (class 2604 OID 17027)
-- Name: servicios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicios ALTER COLUMN id SET DEFAULT nextval('public.servicios_id_seq'::regclass);


--
-- TOC entry 4942 (class 2604 OID 16948)
-- Name: tipos_vehiculo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_vehiculo ALTER COLUMN id SET DEFAULT nextval('public.tipos_vehiculo_id_seq'::regclass);


--
-- TOC entry 4938 (class 2604 OID 16929)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 5189 (class 0 OID 17096)
-- Dependencies: 233
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.feedback (id, servicio_id, calificacion, comentario, es_negativo, fecha_registro) FROM stdin;
\.


--
-- TOC entry 5191 (class 0 OID 17117)
-- Dependencies: 235
-- Data for Name: historial_estados_servicios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_estados_servicios (id, servicio_id, estado_anterior, estado_nuevo, fecha_cambio, usuario_id) FROM stdin;
\.


--
-- TOC entry 5196 (class 0 OID 17206)
-- Dependencies: 243
-- Data for Name: notificaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notificaciones (id, cliente_id, tipo, titulo, mensaje, leido, fecha_envio, fecha_lectura) FROM stdin;
\.


--
-- TOC entry 5187 (class 0 OID 17076)
-- Dependencies: 231
-- Data for Name: pagos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pagos (id, servicio_id, metodo, estado, monto_pagado, fecha_pago) FROM stdin;
\.


--
-- TOC entry 5181 (class 0 OID 16976)
-- Dependencies: 225
-- Data for Name: paquetes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paquetes (id, nombre, descripcion, duracion_minutos, activo, precio_base) FROM stdin;
\.


--
-- TOC entry 5183 (class 0 OID 16990)
-- Dependencies: 227
-- Data for Name: precios_paquetes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.precios_paquetes (id, paquete_id, tipo_id, precio) FROM stdin;
\.


--
-- TOC entry 5194 (class 0 OID 17177)
-- Dependencies: 241
-- Data for Name: promociones_aplicadas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promociones_aplicadas (servicio_id, promocion_id, descuento_ahorrado, fecha_aplicacion) FROM stdin;
\.


--
-- TOC entry 5193 (class 0 OID 17160)
-- Dependencies: 240
-- Data for Name: promociones_temporales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promociones_temporales (id, nombre, descripcion, porcentaje_descuento, fecha_inicio, fecha_fin, activo) FROM stdin;
\.


--
-- TOC entry 5185 (class 0 OID 17024)
-- Dependencies: 229
-- Data for Name: servicios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.servicios (id, cliente_id, lavador_id, vehiculo_placa, paquete_id, estado, monto_total, descuento_aplicado, fecha_creacion, fecha_inicio, fecha_finalizacion) FROM stdin;
\.


--
-- TOC entry 5178 (class 0 OID 16945)
-- Dependencies: 222
-- Data for Name: tipos_vehiculo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipos_vehiculo (id, nombre_tipo) FROM stdin;
\.


--
-- TOC entry 5176 (class 0 OID 16926)
-- Dependencies: 220
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nombre, email, password_hash, telefono, rol, activo, fecha_registro) FROM stdin;
\.


--
-- TOC entry 5179 (class 0 OID 16955)
-- Dependencies: 223
-- Data for Name: vehiculos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehiculos (placa, marca, modelo, color, tipo_id, cliente_id) FROM stdin;
\.


--
-- TOC entry 5212 (class 0 OID 0)
-- Dependencies: 232
-- Name: feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.feedback_id_seq', 1, false);


--
-- TOC entry 5213 (class 0 OID 0)
-- Dependencies: 234
-- Name: historial_estados_servicios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_estados_servicios_id_seq', 1, false);


--
-- TOC entry 5214 (class 0 OID 0)
-- Dependencies: 242
-- Name: notificaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notificaciones_id_seq', 1, false);


--
-- TOC entry 5215 (class 0 OID 0)
-- Dependencies: 230
-- Name: pagos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pagos_id_seq', 1, false);


--
-- TOC entry 5216 (class 0 OID 0)
-- Dependencies: 224
-- Name: paquetes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.paquetes_id_seq', 1, false);


--
-- TOC entry 5217 (class 0 OID 0)
-- Dependencies: 226
-- Name: precios_paquetes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.precios_paquetes_id_seq', 1, false);


--
-- TOC entry 5218 (class 0 OID 0)
-- Dependencies: 239
-- Name: promociones_temporales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.promociones_temporales_id_seq', 1, false);


--
-- TOC entry 5219 (class 0 OID 0)
-- Dependencies: 228
-- Name: servicios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.servicios_id_seq', 1, false);


--
-- TOC entry 5220 (class 0 OID 0)
-- Dependencies: 221
-- Name: tipos_vehiculo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipos_vehiculo_id_seq', 1, false);


--
-- TOC entry 5221 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, false);


--
-- TOC entry 4998 (class 2606 OID 17108)
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- TOC entry 5000 (class 2606 OID 17110)
-- Name: feedback feedback_servicio_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_servicio_id_key UNIQUE (servicio_id);


--
-- TOC entry 5002 (class 2606 OID 17126)
-- Name: historial_estados_servicios historial_estados_servicios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estados_servicios
    ADD CONSTRAINT historial_estados_servicios_pkey PRIMARY KEY (id);


--
-- TOC entry 5008 (class 2606 OID 17221)
-- Name: notificaciones notificaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_pkey PRIMARY KEY (id);


--
-- TOC entry 4996 (class 2606 OID 17089)
-- Name: pagos pagos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pkey PRIMARY KEY (id);


--
-- TOC entry 4988 (class 2606 OID 16988)
-- Name: paquetes paquetes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paquetes
    ADD CONSTRAINT paquetes_pkey PRIMARY KEY (id);


--
-- TOC entry 4990 (class 2606 OID 17002)
-- Name: precios_paquetes precios_paquetes_paquete_id_tipo_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.precios_paquetes
    ADD CONSTRAINT precios_paquetes_paquete_id_tipo_id_key UNIQUE (paquete_id, tipo_id);


--
-- TOC entry 4992 (class 2606 OID 17000)
-- Name: precios_paquetes precios_paquetes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.precios_paquetes
    ADD CONSTRAINT precios_paquetes_pkey PRIMARY KEY (id);


--
-- TOC entry 5006 (class 2606 OID 17186)
-- Name: promociones_aplicadas promociones_aplicadas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promociones_aplicadas
    ADD CONSTRAINT promociones_aplicadas_pkey PRIMARY KEY (servicio_id);


--
-- TOC entry 5004 (class 2606 OID 17176)
-- Name: promociones_temporales promociones_temporales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promociones_temporales
    ADD CONSTRAINT promociones_temporales_pkey PRIMARY KEY (id);


--
-- TOC entry 4994 (class 2606 OID 17038)
-- Name: servicios servicios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicios
    ADD CONSTRAINT servicios_pkey PRIMARY KEY (id);


--
-- TOC entry 4982 (class 2606 OID 16954)
-- Name: tipos_vehiculo tipos_vehiculo_nombre_tipo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_vehiculo
    ADD CONSTRAINT tipos_vehiculo_nombre_tipo_key UNIQUE (nombre_tipo);


--
-- TOC entry 4984 (class 2606 OID 16952)
-- Name: tipos_vehiculo tipos_vehiculo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_vehiculo
    ADD CONSTRAINT tipos_vehiculo_pkey PRIMARY KEY (id);


--
-- TOC entry 4978 (class 2606 OID 16943)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 4980 (class 2606 OID 16941)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4986 (class 2606 OID 16964)
-- Name: vehiculos vehiculos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT vehiculos_pkey PRIMARY KEY (placa);


--
-- TOC entry 5024 (class 2620 OID 17138)
-- Name: servicios trg_historial_servicio; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_historial_servicio AFTER INSERT OR UPDATE ON public.servicios FOR EACH ROW EXECUTE FUNCTION public.log_cambio_estado_servicio();


--
-- TOC entry 5018 (class 2606 OID 17111)
-- Name: feedback feedback_servicio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_servicio_id_fkey FOREIGN KEY (servicio_id) REFERENCES public.servicios(id) ON DELETE CASCADE;


--
-- TOC entry 5019 (class 2606 OID 17127)
-- Name: historial_estados_servicios historial_estados_servicios_servicio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estados_servicios
    ADD CONSTRAINT historial_estados_servicios_servicio_id_fkey FOREIGN KEY (servicio_id) REFERENCES public.servicios(id) ON DELETE CASCADE;


--
-- TOC entry 5020 (class 2606 OID 17132)
-- Name: historial_estados_servicios historial_estados_servicios_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estados_servicios
    ADD CONSTRAINT historial_estados_servicios_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 5023 (class 2606 OID 17222)
-- Name: notificaciones notificaciones_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5017 (class 2606 OID 17090)
-- Name: pagos pagos_servicio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_servicio_id_fkey FOREIGN KEY (servicio_id) REFERENCES public.servicios(id) ON DELETE RESTRICT;


--
-- TOC entry 5011 (class 2606 OID 17003)
-- Name: precios_paquetes precios_paquetes_paquete_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.precios_paquetes
    ADD CONSTRAINT precios_paquetes_paquete_id_fkey FOREIGN KEY (paquete_id) REFERENCES public.paquetes(id) ON DELETE CASCADE;


--
-- TOC entry 5012 (class 2606 OID 17008)
-- Name: precios_paquetes precios_paquetes_tipo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.precios_paquetes
    ADD CONSTRAINT precios_paquetes_tipo_id_fkey FOREIGN KEY (tipo_id) REFERENCES public.tipos_vehiculo(id) ON DELETE CASCADE;


--
-- TOC entry 5021 (class 2606 OID 17192)
-- Name: promociones_aplicadas promociones_aplicadas_promocion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promociones_aplicadas
    ADD CONSTRAINT promociones_aplicadas_promocion_id_fkey FOREIGN KEY (promocion_id) REFERENCES public.promociones_temporales(id) ON DELETE RESTRICT;


--
-- TOC entry 5022 (class 2606 OID 17187)
-- Name: promociones_aplicadas promociones_aplicadas_servicio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promociones_aplicadas
    ADD CONSTRAINT promociones_aplicadas_servicio_id_fkey FOREIGN KEY (servicio_id) REFERENCES public.servicios(id) ON DELETE RESTRICT;


--
-- TOC entry 5013 (class 2606 OID 17039)
-- Name: servicios servicios_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicios
    ADD CONSTRAINT servicios_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.usuarios(id);


--
-- TOC entry 5014 (class 2606 OID 17044)
-- Name: servicios servicios_lavador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicios
    ADD CONSTRAINT servicios_lavador_id_fkey FOREIGN KEY (lavador_id) REFERENCES public.usuarios(id);


--
-- TOC entry 5015 (class 2606 OID 17054)
-- Name: servicios servicios_paquete_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicios
    ADD CONSTRAINT servicios_paquete_id_fkey FOREIGN KEY (paquete_id) REFERENCES public.paquetes(id);


--
-- TOC entry 5016 (class 2606 OID 17049)
-- Name: servicios servicios_vehiculo_placa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicios
    ADD CONSTRAINT servicios_vehiculo_placa_fkey FOREIGN KEY (vehiculo_placa) REFERENCES public.vehiculos(placa) ON UPDATE CASCADE;


--
-- TOC entry 5009 (class 2606 OID 16970)
-- Name: vehiculos vehiculos_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT vehiculos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5010 (class 2606 OID 16965)
-- Name: vehiculos vehiculos_tipo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT vehiculos_tipo_id_fkey FOREIGN KEY (tipo_id) REFERENCES public.tipos_vehiculo(id);


-- Completed on 2026-07-23 15:33:54

--
-- PostgreSQL database dump complete
--

\unrestrict 6xIhQFMElnq6xZvm77FA0SKY9znZotMnH7KQbccRNlMJIVQ7jlcespgiRHoutGY

