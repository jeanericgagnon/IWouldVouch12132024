// Previous imports remain the same...

export function PortfolioSkillsSection({ user, onUpdateUser }: PortfolioSkillsSectionProps) {
  // Previous state declarations remain the same...

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rest of your portfolio content */}
        <div className="flex justify-between items-center">
          <Label>Portfolio Items ({portfolioItems.length}/5)</Label>
          <Button
            onClick={() => setIsAddingItem(true)}
            disabled={portfolioItems.length >= 5}
            className="bg-[#52789e] hover:bg-[#6b9cc3] text-white"
          >
            Add Portfolio Item
          </Button>
        </div>
        {/* Rest of the component remains the same... */}
      </CardContent>
    </Card>
  );
}