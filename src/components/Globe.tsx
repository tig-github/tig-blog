"use client";

import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import { geoOrthographic, geoPath } from "d3-geo";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import topology from "../../public/countries-110m.json";
import styles from "./globe.module.css";
import pageStyles from "../app/places/places.module.css";
import { visitedWithoutPosts } from "../utils/places";

type CountryFeature = GeoJSON.Feature<GeoJSON.Geometry, { name: string }>;

const countryTopology = topology as unknown as Topology<{
  countries: GeometryCollection<{ name: string }>;
}>;
const countryFeatures = feature(countryTopology, countryTopology.objects.countries)
  .features as CountryFeature[];
const globeCountryFeatures = countryFeatures.flatMap((country) => {
  if (country.properties.name !== "France" || country.geometry.type !== "MultiPolygon") {
    return [country];
  }

  const [frenchGuiana, ...france] = country.geometry.coordinates;
  if (!frenchGuiana) return [country];

  return [
    { ...country, geometry: { ...country.geometry, coordinates: france } },
    {
      type: "Feature" as const,
      id: "french-guiana",
      properties: { name: "French Guiana" },
      geometry: { type: "MultiPolygon" as const, coordinates: [frenchGuiana] },
    },
  ];
});

const minZoom = 1;
const maxZoom = 2.2;

type PlacePost = { id: string; title: string; date: string; countries: string[] };

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

function displayCountryName(country: string) {
  return country === "United States of America" ? "USA" : country;
}

export default function Globe({ countries, posts }: { countries: string[]; posts: PlacePost[] }) {
  const [rotation, setRotation] = useState<[number, number, number]>([0, -18, 0]);
  const [selected, setSelected] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [dragged, setDragged] = useState(false);
  const [startCountry, setStartCountry] = useState<string | null>(null);
  const globeRef = useRef<SVGSVGElement | null>(null);
  const pointerActive = useRef(false);
  const zoomRef = useRef(1);
  const rotationResumeTimer = useRef<number | null>(null);
  const countriesWithPosts = useMemo(() => new Set(countries), [countries]);
  const visited = useMemo(
    () => new Set([...countries, ...visitedWithoutPosts]),
    [countries],
  );
  const projection = geoOrthographic().translate([360, 310]).scale(270 * zoom).rotate(rotation).clipAngle(90);
  const path = geoPath(projection);

  const scheduleRotationResume = useCallback(() => {
    if (rotationResumeTimer.current) window.clearTimeout(rotationResumeTimer.current);
    rotationResumeTimer.current = window.setTimeout(() => {
      if (!pointerActive.current) setAutoRotate(true);
    }, 5000);
  }, []);

  const noteInteraction = useCallback(() => {
    setAutoRotate(false);
    scheduleRotationResume();
  }, [scheduleRotationResume]);

  useEffect(() => {
    setAutoRotate(true);
    return () => {
      if (rotationResumeTimer.current) window.clearTimeout(rotationResumeTimer.current);
    };
  }, [scheduleRotationResume]);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const nextZoom = Math.min(maxZoom, Math.max(minZoom, zoomRef.current * Math.exp(-event.deltaY * 0.0015)));
      if (nextZoom !== zoomRef.current) {
        zoomRef.current = nextZoom;
        setZoom(nextZoom);
      }
    };

    globe.addEventListener("wheel", handleWheel, { passive: false });
    return () => globe.removeEventListener("wheel", handleWheel);
  }, []);

  useEffect(() => {
    if (!autoRotate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setRotation(([longitude, latitude]) => [longitude + 0.18, latitude, 0]);
    }, 50);
    return () => window.clearInterval(timer);
  }, [autoRotate]);

  function beginDrag(event: React.PointerEvent<SVGSVGElement>) {
    pointerActive.current = true;
    noteInteraction();
    setDrag({ x: event.clientX, y: event.clientY });
    setDragged(false);
    setStartCountry(event.target instanceof Element ? event.target.closest("[data-country]")?.getAttribute("data-country") ?? null : null);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function endDrag() {
    if (!dragged && startCountry && visited.has(startCountry)) {
      setSelected(startCountry === selected ? null : startCountry);
    }
    setDrag(null);
    setStartCountry(null);
    pointerActive.current = false;
    noteInteraction();
  }

  function moveDrag(event: React.PointerEvent<SVGSVGElement>) {
    if (!drag) return;
    noteInteraction();
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 2) setDragged(true);
    setRotation(([longitude, latitude]) => [longitude + dx * 0.35, Math.max(-75, Math.min(75, latitude - dy * 0.35)), 0]);
    setDrag({ x: event.clientX, y: event.clientY });
  }

  return (
    <div className={styles.wrapper}>
      <svg
        ref={globeRef}
        className={styles.globe}
        viewBox="0 0 720 620"
        role="group"
        aria-label="Interactive globe. Drag to rotate, then click a shaded country to see its posts."
        onFocus={noteInteraction}
        onPointerDown={beginDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={() => {
          setDrag(null);
          setStartCountry(null);
          pointerActive.current = false;
          noteInteraction();
        }}
      >
        <defs>
          <clipPath id="globe-clip"><circle cx="360" cy="310" r="270" /></clipPath>
        </defs>
        <circle className={styles.ocean} cx="360" cy="310" r="270" />
        <g clipPath="url(#globe-clip)">
          {globeCountryFeatures.map((country) => {
            const name = country.properties.name;
            const hasStories = countriesWithPosts.has(name);
            const hasVisited = visited.has(name);
            return (
              <path
                key={country.id ?? country.properties.name}
                data-country={name}
                d={path(country) ?? ""}
                className={`${styles.country} ${hasVisited ? styles.visited : ""} ${selected === name ? styles.selected : ""}`}
                aria-label={hasStories ? `${name}, stories available` : hasVisited ? `${name}, visited, no posts yet` : name}
                tabIndex={hasVisited ? 0 : -1}
                role={hasVisited ? "button" : undefined}
                onKeyDown={(event) => {
                  noteInteraction();
                  if (hasVisited && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    setSelected(name === selected ? null : name);
                  }
                }}
              >
                <title>{hasStories ? `${name} — explore stories` : hasVisited ? `${name} — visited, no posts yet` : name}</title>
              </path>
            );
          })}
        </g>
      </svg>
      {selected && (
        <section className={pageStyles.stories} aria-live="polite">
          <h2 className={pageStyles.storyHeading}>Posts from {displayCountryName(selected)}</h2>
          <div className={pageStyles.countryStories}>
            {posts.filter((post) => post.countries.includes(selected)).map((post) => (
              <article className={pageStyles.post} key={post.id}>
                <Link href={`/blog/${post.id}`}>{post.title}</Link>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </article>
            ))}
            {!countriesWithPosts.has(selected) && <p>No posts yet.</p>}
          </div>
        </section>
      )}
    </div>
  );
}
