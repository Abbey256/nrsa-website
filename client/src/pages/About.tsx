import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Eye, Users, Award } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About NRSA</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl">
            Nigeria Rope Skipping Association - Committed to excellence, integrity, and developing world-class athletes.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-3xl text-primary">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-lg leading-relaxed text-foreground/80">
                To promote, develop, and regulate rope skipping across Nigeria, fostering athletic excellence 
                and providing opportunities for all Nigerians to participate in this dynamic sport. We are 
                committed to creating pathways for athletes from grassroots to elite levels.
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-3xl text-primary">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-lg leading-relaxed text-foreground/80">
                To establish Nigeria as a leading force in international rope skipping, producing world-class 
                athletes and hosting premier competitions that showcase Nigerian talent on the global stage. 
                We envision a future where rope skipping is recognized as a mainstream sport in Nigeria.
              </CardContent>
            </Card>
          </div>

          {/* History */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-3xl text-primary">Our History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-lg leading-relaxed text-foreground/80">
              <p>
                The Nigeria Rope Skipping Association (NRSA) was established as the official governing body 
                for rope skipping in Nigeria, with the mandate to organize, promote, and develop the sport 
                across all 36 states and the Federal Capital Territory.
              </p>
              <p>
                Since our inception, we have been instrumental in creating structured pathways for athletes, 
                from grassroots development programs to elite-level competitions. Our affiliation with 
                international bodies such as the International Jump Rope Union (IJRU) and the International 
                Rope Skipping Organization (IRSO) ensures that Nigerian athletes compete at the highest 
                standards globally.
              </p>
              <p>
                NRSA has successfully organized numerous national championships, training camps, and 
                certification programs for coaches and officials. We continue to work tirelessly to expand 
                the reach of rope skipping to schools, communities, and athletic clubs nationwide.
              </p>
            </CardContent>
          </Card>

          {/* Organizational Structure */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-primary mb-8">Organizational Structure</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Executive Board</h3>
                  <p className="text-muted-foreground">
                    Strategic leadership and governance oversight
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Technical Committee</h3>
                  <p className="text-muted-foreground">
                    Competition standards and athlete development
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">State Chapters</h3>
                  <p className="text-muted-foreground">
                    Grassroots programs across 36 states
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* International Affiliations */}
          <div>
            <h2 className="text-3xl font-bold text-primary mb-8">International Affiliations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl font-bold text-primary">IJRU</div>
                    <Badge className="bg-primary text-primary-foreground">Member</Badge>
                  </div>
                  <CardTitle className="text-2xl">International Jump Rope Union</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground/80 leading-relaxed">
                    IJRU is the global governing body for rope skipping, setting international standards for 
                    competitions, judging, and athlete development. As a member organization, NRSA athletes 
                    compete under IJRU rules and regulations.
                  </p>
                  <a 
                    href="https://ijru.sport" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block text-primary hover:underline font-semibold"
                    data-testid="link-ijru-website"
                  >
                    Visit IJRU.sport →
                  </a>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl font-bold text-primary">IRSO</div>
                    <Badge className="bg-primary text-primary-foreground">Affiliated</Badge>
                  </div>
                  <CardTitle className="text-2xl">International Rope Skipping Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground/80 leading-relaxed">
                    IRSO promotes rope skipping as a competitive sport worldwide, fostering international 
                    collaboration and hosting global events. Our affiliation ensures Nigerian athletes have 
                    access to international competitions and development programs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
