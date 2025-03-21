interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="space-y-2 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-primary">
        {title}
      </h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
